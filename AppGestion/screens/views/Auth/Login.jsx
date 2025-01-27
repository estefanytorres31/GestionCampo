import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import PSC from "../image/PSC.png";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const { username, password } = credentials;

    if (!username || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("Clientes"); // Cambia "Home" por la vista a la que deseas navegar
    }, 2000); // Simula un retraso en la autenticación
  };

  return (
    <LinearGradient
      colors={["#E9E9E9", "#143168"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.modal}>
        {/* Logo */}
        <Image source={PSC} style={styles.logo} />

        {/* Input Container */}
        <View style={styles.inputContainer}>
          {/* Username Input */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={24} color="#143168" style={styles.icon} />
            <TextInput
              placeholder="Username"
              style={styles.input}
              placeholderTextColor="#143168"
              value={credentials.username}
              onChangeText={(text) => setCredentials({ ...credentials, username: text })}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={24} color="#143168" style={styles.icon} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#143168"
              value={credentials.password}
              onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#143168" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    width: "90%",
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
 inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E9E9E9",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
    width: "100%",
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
    backgroundColor: "#143168",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;