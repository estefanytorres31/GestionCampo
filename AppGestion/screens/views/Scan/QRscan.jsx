import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Button from '../../components/Buttons';
import { Overlay } from '../../components/Overlay';

const { width, height } = Dimensions.get("window");

const QRScann = ({ navigation }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [regionOfInterest, setRegionOfInterest] = useState(null);
  const [cameraProps, setCameraProps] = useState({
    zoom: 0,
    facing: 'back',
    flash: 'on',
    animateShutter: false,
    enableTorch: false,
  });
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const qrCodeLock = useRef(false);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setIsActive(true);
      setScanning(false);
      qrCodeLock.current = false;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsActive(false);
      setScanning(true);
      setCameraProps(prev => ({
        ...prev,
        enableTorch: false,
        flash: 'off'
      }));
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    if (!cameraPermission) {
      setPermissionModalVisible(true);
    } else if (cameraPermission.status === 'denied') {
      Alert.alert(
        'Permiso de cámara denegado', 
        'Por favor, habilite los permisos de cámara en la configuración de la aplicación.'
      );
    }
  }, [cameraPermission]);

  const handleRegionOfInterest = (roi) => {
    setRegionOfInterest(roi);
  };

  const toggleProperty = (prop, option1, option2) => {
    if (!isActive) return; // Prevenir cambios cuando la pantalla no está activa
    setCameraProps((current) => ({
      ...current,
      [prop]: current[prop] === option1 ? option2 : option1,
    }));
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (!qrCodeLock.current && isActive) {
      qrCodeLock.current = true;
      setScanning(true);
      navigation.navigate('Menu', { qrData: data });
    }
  };

  const requestPermission = async () => {
    const result = await requestCameraPermission();
    if (result.granted) {
      setPermissionModalVisible(false);
    } else {
      Alert.alert(
        'Permiso denegado', 
        'No se puede continuar sin permisos de cámara.'
      );
    }
  };

  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <Modal
        visible={permissionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPermissionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Necesitamos permiso de cámara para continuar.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={requestPermission}
              accessibilityLabel="Solicitar permiso de cámara"
            >
              <Text style={styles.modalButtonText}>Dar permiso</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (!isActive) {
    return <View style={styles.inactiveContainer} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topControlsContainer}>
        <Button
          icon={cameraProps.flash === 'on' ? 'flash-on' : 'flash-off'}
          onPress={() => toggleProperty('flash', 'on', 'off')}
          accessibilityLabel={`Cambiar flash ${cameraProps.flash === 'on' ? 'apagado' : 'encendido'}`}
        />
        <Button
          icon={cameraProps.enableTorch ? 'flashlight-on' : 'flashlight-off'}
          onPress={() => toggleProperty('enableTorch', true, false)}
          accessibilityLabel={`Cambiar linterna ${cameraProps.enableTorch ? 'apagada' : 'encendida'}`}
        />
      </View>
      {isActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          zoom={cameraProps.zoom}
          facing={cameraProps.facing}
          flash={cameraProps.flash}
          enableTorch={cameraProps.enableTorch}
          onBarcodeScanned={scanning ? undefined : handleBarcodeScanned}
          scannerType="qr"
          scannerOptions={{
            region: regionOfInterest
              ? {
                  x: regionOfInterest.x / width,
                  y: regionOfInterest.y / height,
                  width: regionOfInterest.width / width,
                  height: regionOfInterest.height / height,
                }
              : undefined,
          }}
        >
          <Overlay onRegionOfInterest={handleRegionOfInterest} />
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inactiveContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  topControlsContainer: {
    height: 60,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QRScann;