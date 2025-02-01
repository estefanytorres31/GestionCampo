import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import useAsistencia from "../../hooks/Asistencia/useAsistencia";

const Menu = ({ route }) => {
  const qrData = route?.params?.qrData || "";
  const idOrden = route?.params?.idOrden || null;
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const { registerAttendance, lastAttendance, loading, loadLastAttendance } =
    useAsistencia();
  const parsedQrData = qrData ? JSON.parse(qrData) : null;

  // Cargar la última asistencia al montar la pantalla
  useEffect(() => {
    if (idOrden) {
      loadLastAttendance(idOrden);
    }
  }, [idOrden]);

  const handleAttendance = async (tipo) => {
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Se requiere permiso para acceder a la ubicación");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);

      const response = await registerAttendance({
        id_embarcacion: parsedQrData.id,
        tipo,
        latitud: location.coords.latitude.toString(),
        longitud: location.coords.longitude.toString(),
        id_orden_trabajo: idOrden,
      });
      console.log(response);
      if (response && !response.error) {
        navigation.navigate("Mantto", { idOrden });
      }
      if (response.error) {
        setError(response.error);
        return;
      }
    } catch (err) {
      setError(err.message || "Error al obtener la ubicación");
    }
  };

  if (!parsedQrData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: No se recibió información del código QR.
        </Text>
      </View>
    );
  }

  // 🔍 Determinar qué botón mostrar
  const showEntrada = !lastAttendance || lastAttendance.tipo === "salida";
  const showSalida = lastAttendance && lastAttendance.tipo === "entrada";

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
        <Text style={styles.qrText}>
          {`${parsedQrData.nombre} - ${parsedQrData.empresa}`}
        </Text>
      </View>

      <View style={styles.attendanceContainer}>
        {showEntrada && (
          <TouchableOpacity
            style={[styles.attendanceButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => handleAttendance("entrada")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon
                  name="login"
                  size={24}
                  color="#FFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Registrar Entrada</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {showSalida && (
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              { backgroundColor: "#f44336", marginTop: 16 },
            ]}
            onPress={() => handleAttendance("salida")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon
                  name="logout"
                  size={24}
                  color="#FFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Registrar Salida</Text>
              </>
            )}
          </TouchableOpacity>
        )}
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
