import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from 'expo-location';

const Menu = ({ route }) => {
  const qrData = route?.params?.qrData || "";
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAttendance, setLastAttendance] = useState(null);
  const [userData, setUserData] = useState(null);


  const getLocation = async () => {
    if (!userData?.id) {
      Alert.alert('Error', 'No se encontraron datos del usuario');
      return;
    }

    if (!qrData) {
      Alert.alert('Error', 'Código QR inválido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Se requiere permiso para acceder a la ubicación');
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (!locationData) {
        throw new Error('No se pudo obtener la ubicación');
      }

      setLocation(locationData);

      const asistenciaData = {
        id_usuario: userData.id,
        id_embarcacion: parseInt(qrData, 10),
        tipo: determinarTipoAsistencia(),
        latitud: locationData.coords.latitude,
        longitud: locationData.coords.longitude
      };

      // Using apiClient instead of axios directly
      const response = await apiClient.post('/asistencias', asistenciaData);

      if (response.data?.data) {
        setLastAttendance(response.data.data);
        Alert.alert(
          'Éxito',
          `Asistencia de ${asistenciaData.tipo} registrada exitosamente`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar la asistencia';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderAttendanceButton = () => {
    const tipoAsistencia = determinarTipoAsistencia();
    const buttonText = tipoAsistencia === "entrada" ? "Registrar Entrada" : "Registrar Salida";
    const buttonIcon = tipoAsistencia === "entrada" ? "login" : "logout";

    return (
      <TouchableOpacity
        style={[
          styles.attendanceButton,
          { backgroundColor: tipoAsistencia === "entrada" ? "#4299E1" : "#48BB78" }
        ]}
        onPress={getLocation}
        disabled={loading || !userData}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Icon name={buttonIcon} size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{buttonText}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  if (!qrData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: No se recibió información del código QR.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro de Asistencia</Text>
        <Text style={styles.subtitle}>con coordenadas GPS</Text>
      </View>

      <View style={styles.qrContainer}>
        <View style={styles.qrWrapper}>
          <QRCode value={qrData} size={200} />
        </View>
        <Text style={styles.qrText}>ID Embarcación: {qrData}</Text>
      </View>

      {lastAttendance && (
        <View style={styles.lastAttendanceInfo}>
          <Icon 
            name={lastAttendance.tipo === "entrada" ? "login" : "logout"} 
            size={24} 
            color="#4CAF50" 
          />
          <Text style={styles.lastAttendanceText}>
            Última {lastAttendance.tipo}: {new Date(lastAttendance.fecha_hora).toLocaleTimeString()}
          </Text>
        </View>
      )}

      <View style={styles.attendanceContainer}>
        {renderAttendanceButton()}

        {location && (
          <View style={styles.locationInfo}>
            <Icon name="map-marker-check" size={20} color="#4CAF50" />
            <Text style={styles.locationText}>Ubicación registrada</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={20} color="#f44336" />
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  lastAttendanceInfo: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  lastAttendanceText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#718096",
    marginTop: 8,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  qrWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  qrText: {
    fontSize: 16,
    color: "#4A5568",
    marginTop: 16,
    fontWeight: "500",
  },
  attendanceContainer: {
    alignItems: "center",
  },
  attendanceButton: {
    backgroundColor: "#4299E1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#4299E1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#E6FFE8",
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#FFE8E8",
    padding: 12,
    borderRadius: 8,
  },
  errorMessage: {
    marginLeft: 8,
    color: "#f44336",
    fontSize: 16,
  },
});

export default Menu;