import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/views/Auth/Login";
import InicioJefe from "./screens/views/Inicio/InicioJefe";
import Inicio from "./screens/views/Inicio/Inicio";
import Clientes from "./screens/views/client/Client";
import TrabajosAsignadosScreen from "./screens/views/Lista/TrabajosAsignados";
import useAuth from "./screens/hooks/Auth/useAuth";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [initialRoute, setInitialRoute] = useState("Login");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    const checkStoredRoles = async () => {
      try {
        const rolesStr = await AsyncStorage.getItem("roles");
        const roles = rolesStr ? JSON.parse(rolesStr) : [];
        console.log("Roles from AsyncStorage:", roles);
        if (roles.includes("Jefe")) {
          setInitialRoute("InicioJefe");
        } else if (roles.includes("Técnico")) {
          setInitialRoute("Inicio");
        } else if (roles.includes("Administrador")) {
          setInitialRoute("Clientes");
        } else {
          setInitialRoute("Login");
        }
      } catch (err) {
        console.error("Error reading roles from AsyncStorage:", err);
        setInitialRoute("Login");
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkStoredRoles();
  }, []);

  if (!isAuthChecked || loading) {
    // Mientras se verifica la autenticación, puedes mostrar un spinner o retornar null
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InicioJefe"
          component={InicioJefe}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Clientes" component={Clientes} />
        <Stack.Screen
          name="TrabajosAsignados"
          component={TrabajosAsignadosScreen}
          options={{ title: "Mis Trabajos" }}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{ headerShown: false }}
        />
        {/* Agrega aquí las demás pantallas */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
