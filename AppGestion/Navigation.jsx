import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import Rol from "./screens/views/Auth/Roles"
import Clientes from "./screens/views/client/Client";
import EmbarcacionesScreen from "./screens/views/Embarcacion/Embarcacion";
import Inicio from "./screens/views/Scan/Inicio";
import Trabajo from "./screens/views/TipoTrabajo/TipoTrabajo";
import AsignarTrabajoScreen from "./screens/views/AsignarTrabajo/AsignarTrabajo";
import SeleccionarAyudantesScreen from "./screens/views/AsignarTrabajo/SeleccionarAyudantes";
import QRScann from "./screens/views/Scan/QRscan";
import SistemasScreen from "./screens/views/Sistemas/Sistemas";
import Menu from "./screens/views/Asistencia/Menu";
import SeleccionarTecnicoScreen from "./screens/views/AsignarTrabajo/SeleccionarTecnico";
import AuthContext from "./screens/context/Auth/AuthContext";
import Mantto from "./screens/views/Checklist/Mantto";
import Montaje from "./screens/views/Checklist/Montaje";
import FormPreventivo from "./screens/views/Formularios/FormPreventivo";
import FormMontaje from "./screens/views/Formularios/FormMontaje";
import Desmont from "./screens/views/Boton/Desmont";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TrabajosAsignadosScreen from "./screens/views/AsignarTrabajo/TrabajosAsignados";

const Stack = createNativeStackNavigator();

export default function Navigation () {
    const { user, role, isAuth, loading } = useContext(AuthContext);  // Accedemos al rol y autenticación desde el contexto
    const [isAdmin, setIsAdmin] = useState(false);


    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Login" >
                <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
                <Stack.Screen name="Rol" component={Rol} options={{ headerShown: false }} />
                <Stack.Screen name="Clientes" component={Clientes}  options={{ title: "Clientes" , headerShown:false}} />
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

                <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }}/>
                <Stack.Screen name="QRScann" component={QRScann} options={{ title: "Escaneo de QR" }} />
                <Stack.Screen name="Menu" component={Menu} options={{ title: "Menú"}} />
                <Stack.Screen name="Mantto" component={Mantto} options={{ title: "Mantto Preventivo" }} />
                <Stack.Screen name="Montaje" component={Montaje} options={{ title: "Desmontaje / Montaje" }} />
                <Stack.Screen name="FormPreventivo" component={FormPreventivo} options={{ title: "Formulario Preventivo" }} />
                <Stack.Screen name="FormMontaje" component={FormMontaje} options={{ title: "Formulario Montaje" }} />
                <Stack.Screen name="Desmont" component={Desmont} options={{ title: "Desmontaje / Montaje" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
