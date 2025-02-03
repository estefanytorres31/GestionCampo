import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useAuth from "../../hooks/Auth/useAuth";

const { width } = Dimensions.get("window");

const JefeScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <LinearGradient 
      colors={["#352F44", "#5D3587"]} 
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
              colors={["#6A5ACD", "#483D8B"]}
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
              colors={["#4B0082", "#8A2BE2"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="qr-code-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Escanear QR</Text>
            </LinearGradient>
          </TouchableOpacity>

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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#CAC4CE",
    marginTop: 10,
  },
  buttonContainer: {
    width: width * 0.8,
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
  logoutButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default JefeScreen;