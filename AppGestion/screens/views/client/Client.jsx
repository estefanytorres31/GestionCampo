import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const ClientScreen = () => {
  return (
    <LinearGradient
      colors={["#def8f6", "#e0e0e0"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Text style={styles.title}>Clientes</Text>
      <Text style={styles.subtitle}>Selecciona un cliente</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.exalmar]}>
          <Ionicons name="boat" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Exalmar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.austral]}>
          <Ionicons name="boat" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Austral</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.diamante]}>
          <Ionicons name="boat" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Diamante</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.centinela]}>
          <Ionicons name="boat" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Centinela</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#EB1111" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 25,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    paddingTop:"50",
  },
  buttonContainer: {
    alignItems: "stretch",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 12,
  },
  exalmar: {
    backgroundColor: "#00897B",
  },
  austral: {
    backgroundColor: "#2E7D32",
  },
  diamante: {
    backgroundColor: "#C0911F",
  },
  centinela: {
    backgroundColor: "#1565C0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 24,
    marginTop: 20,
    alignSelf: "center",
    width: 200,
    elevation: 5,
    shadowColor: "rgb(26, 26, 26)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#EB1111",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ClientScreen

