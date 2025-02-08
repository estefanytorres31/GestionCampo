import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import Clientes from "./screens/views/client/Client";
import EmbarcacionesScreen from "./screens/views/Embarcacion/Embarcacion";
import Inicio from "./screens/views/Inicio/Inicio";
import Trabajo from "./screens/views/TipoTrabajo/TipoTrabajo";
import AsignarTrabajoScreen from "./screens/views/AsignarTrabajo/AsignarTrabajo";
import SeleccionarAyudantesScreen from "./screens/views/AsignarTrabajo/SeleccionarAyudantes";
import QRScann from "./screens/views/Scan/QRscan";
import SistemasScreen from "./screens/views/Sistemas/Sistemas";
import Menu from "./screens/views/Asistencia/Menu";
import SeleccionarTecnicoScreen from "./screens/views/AsignarTrabajo/SeleccionarTecnico";
import ListaOTAsignado from "./screens/views/Lista/ListaTrabajoAsigJefe";
import Mantto from "./screens/views/Checklist/Mantto";
import Montaje from "./screens/views/Checklist/Montaje";
import FormPreventivo from "./screens/views/Formularios/FormPreventivo";
import FormMontaje from "./screens/views/Formularios/FormMontaje";
import FormCorrectivo from "./screens/views/Formularios/FormCorrectivo";
import FormProyecto from "./screens/views/Formularios/FormProyecto";
import Desmont from "./screens/views/Boton/Desmont";
import useAuth from "./screens/hooks/Auth/useAuth";
import InicioJefe from "./screens/views/Inicio/InicioJefe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TrabajosAsignadosScreen from "./screens/views/Lista/TrabajosAsignados";

const Stack = createNativeStackNavigator();

export default function Navigation () {
  const [initialRoute, setInitialRoute] = useState("Login");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { loading , role} = useAuth();

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
        <NavigationContainer >
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
                <Stack.Screen name="InicioJefe" component={InicioJefe} options={{ tittle:"Inicio",headerShown: false }} />
                <Stack.Screen name="ListaOTAsignado" component={ListaOTAsignado} options={{ title: "Lista de OT" }} />
                <Stack.Screen name="Clientes" component={Clientes} />
                <Stack.Screen name="Embarcaciones" component={EmbarcacionesScreen} />
                <Stack.Screen name="Trabajo" component={Trabajo} />
                <Stack.Screen name="Sistemas" component={SistemasScreen} options={{title:"Sistemas"}}/>
                <Stack.Screen
                name="Asignar"
                component={AsignarTrabajoScreen}
                />
                <Stack.Screen
                name="SeleccionarAyudantes"
                component={SeleccionarAyudantesScreen}
                />
                <Stack.Screen
                name="SeleccionarTecnico"
                component={SeleccionarTecnicoScreen}
                />
                <Stack.Screen 
                name="TrabajosAsignados" 
                component={TrabajosAsignadosScreen} 
                options={{ title: "Mis Trabajos" }} 
                />
                <Stack.Screen 
                name="Inicio" 
                component={Inicio}  
                options={{ headerShown: role?.includes("Jefe") ? true : false }}
                />
                <Stack.Screen name="QRScann" component={QRScann} options={{ title: "Escaneo de QR" }} />
                <Stack.Screen name="Menu" component={Menu} options={{ title: "Menú"}} />
                <Stack.Screen name="Mantto" component={Mantto} options={{ title: "Mantenimiento Preventivo" }} />
                <Stack.Screen name="Montaje" component={Montaje} options={{ title: "Desmontaje / Montaje" }} />
                <Stack.Screen name="FormPreventivo" component={FormPreventivo} options={{ title: "Formulario Preventivo" }} />
                <Stack.Screen name="FormMontaje" component={FormMontaje} options={{ title: "Formulario Montaje" }} />
                <Stack.Screen name="FormCorrectivo" component={FormCorrectivo} options={{ title: "Formulario Correctivo" }} />
                <Stack.Screen name="FormProyecto" component={FormProyecto} options={{ title: "Formulario de Proyecto" }} />
                <Stack.Screen name="Desmont" component={Desmont} options={{ title: "Desmontaje / Montaje" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}