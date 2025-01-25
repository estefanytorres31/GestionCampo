import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = () => {
  return (
    <LinearGradient
      colors={['#E9E9E9', '#143168']} 
      style={styles.container}
      start={{x: 0.5, y: 0}} 
      end={{x: 0.5, y: 1}}
    >
      <View style={styles.modal}>
        {/* Logo */}
        <Image
          source={{ uri: "https://www.serviciosperucontrols.com/assets/logo.png" }}
          style={styles.logo}
        />

        {/* Input Container */}
        <View style={styles.inputContainer}>
          {/* Username Input */}
          <View style={[styles.inputBox, { marginBottom: 20 }]}>
            <Ionicons name="person-outline" size={24} color="#143168" style={styles.icon} />
            <TextInput
              placeholder="Username"
              style={[styles.input, { borderColor: '#143168' }]}
              placeholderTextColor="#143168"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={24} color="#143168" style={styles.icon} />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={[styles.input, { borderColor: '#143168' }]}
              placeholderTextColor="#143168"
            />
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
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
  modal: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
    width: 300,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#143168",
  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#143168",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;