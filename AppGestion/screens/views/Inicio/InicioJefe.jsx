import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useAuth from "../../hooks/Auth/useAuth";

const { width, height } = Dimensions.get("window");

const JefeScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <LinearGradient 
      colors={["#549fcb", "#cfe3ea","#0a4472"]} 
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Panel de Control</Text>
          <Text style={styles.subtitle}>Administración</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Clientes")}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#3766b8", "#6087ca"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="clipboard-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Asignar OT</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Inicio")}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#044597", "#3877c8"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="qr-code-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Escanear QR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8B0000", "#B22222"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 80,
  },
  headerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2e4357",
    letterSpacing: 1,
    shadowColor: "#000",
  },
  subtitle: {
    fontSize: 18,
    color: "#5c7085",
    shadowColor: "#000",
    fontWeight: "600",
    marginTop: 10,
  },
  buttonContainer: {
    width: width * 0.8,
    justifyContent: "center",
  },
  button: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },
  logoutContainer: {
    width: width * 0.8,
  },
  logoutButton: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default JefeScreen;