import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
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

const Stack = createNativeStackNavigator();

export default function Navigation () {
    const { user, role, isAuth, loading } = useContext(AuthContext);  // Accedemos al rol y autenticación desde el contexto
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (role) {
          // Verificamos si el usuario tiene el rol de 'Administrador'
          setIsAdmin(role.some(r => r.rol.nombre_rol === 'Administrador')); 
          
        }
      }, [role]);


    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Inicio" >
                <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
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
                <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }}/>
                <Stack.Screen name="QRScann" component={QRScann} options={{ title: "Escaneo de QR" }} />
                <Stack.Screen name="Menu" component={Menu} options={{ title: "Menú"}} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
