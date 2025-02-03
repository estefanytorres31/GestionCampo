import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PSC from "../image/PSC.png";
import useAuth from '../../hooks/Auth/useAuth';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loginAccess } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Alertas
  const [alertConfig, setAlertConfig] = useState({
    type: '',
    title: '',
    message: ''
  });
  const [alertVisible, setAlertVisible] = useState(false);

  const navigateToRoleScreen = (role) => {
    switch (role) {
        case 'Administrador':
            navigation.navigate('Clientes');
            break;
        case 'Jefe':
            navigation.navigate('InicioJefe');
            break;
        case 'Técnico':
            navigation.navigate('Inicio');
            break;
        default:
            navigation.navigate('Login');
    }
};

const handleLogin = async () => {
  const { username, password } = credentials;
  if (!username || !password) {
    setAlertConfig({
      type: 'INFO',
      title: 'Campos vacíos',
      message: 'Por favor, completa todos los campos.',
    });
    setAlertVisible(true);
    return;
  }

  try {
    setIsLoading(true);
    const result = await loginAccess(username, password);

    if (result.status === 200 && result.data?.token) {
      const roles = result.data?.roles || []; // Asegura que 'roles' sea un array válido

      if (roles.includes("Jefe")) {
        navigation.replace("InicioJefe");
      } else if (roles.includes("Técnico")) {
        navigation.replace("Inicio");
      } else if (roles.includes("Administrador")) {
        navigation.replace("Clientes");
      } else {
        setAlertConfig({
          type: 'ERROR',
          title: 'Acceso denegado',
          message: 'No tienes un rol válido asignado. Contacta al administrador.',
        });
        setAlertVisible(true);
      }
    } else {
      setAlertConfig({
        type: 'ERROR',
        title: 'Inicio de sesión fallido',
        message: 'Usuario o contraseña incorrectos.',
      });
      setAlertVisible(true);
    }
  } catch (error) {
    console.error("Login error:", error);
    setAlertConfig({
      type: 'ERROR',
      title: 'Error de conexión',
      message: 'No se pudo conectar al servidor. Por favor, intenta más tarde.',
    });
    setAlertVisible(true);
  } finally {
    setIsLoading(false);
  }
};


  const showAlert = () => {
    if (alertVisible) {
      Alert.alert(
        alertConfig.title,
        alertConfig.message,
        [{ text: "OK", onPress: () => setAlertVisible(false) }]
      );
    }
  };

  React.useEffect(() => {
    if (alertVisible) {
      showAlert();
    }
  }, [alertVisible]);

  return (
    <LinearGradient
      colors={["#E9E9E9", "#143168"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.modal}>
        <Image source={PSC} style={styles.logo} />

        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, error && styles.inputError]}>
            <Ionicons name="person-outline" size={24} color="#143168" style={styles.icon} />
            <TextInput
              placeholder="Username"
              style={styles.input}
              placeholderTextColor="#143168"
              //value={credentials.username}
              onChangeText={(text) => {
                setError("");
                setCredentials({ ...credentials, username: text });
              }}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputBox, error && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={24} color="#143168" style={styles.icon} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#143168"
              //value={credentials.password}
              onChangeText={(text) => {
                setError("");
                setCredentials({ ...credentials, password: text });
              }}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="#143168" 
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin} 
          disabled={isLoading}
        >
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
  inputError: {
    borderColor: '#ff0000',
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
  buttonDisabled: {
    backgroundColor: '#888',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;