import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = () => {
  return (
    <LinearGradient
      colors={['#E9E9E9', '#143168']} 
      style={styles.container}
    >
      {/* Logo */}
      <Image
        source={{ uri: "https://via.placeholder.com/150x80.png?text=PCS+Logo" }}
        style={styles.logo}
      />
      <Text style={styles.slogan}>Sailing Into The Future Together</Text>

      {/* Input Usuario */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
        <TextInput
          placeholder="Usuario"
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Input Contraseña */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Botón Iniciar Sesión */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 20,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
