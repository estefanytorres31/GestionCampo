import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import Clientes from "./screens/views/client/Client";
import EmbarcacionesScreen from "./screens/views/Embarcacion/Embarcacion";
import Inicio from "./screens/views/Scan/Inicio";
import Trabajo from "./screens/views/TipoTrabajo/TipoTrabajo";
import QRScann from "./screens/views/Scan/QRscan";
import Menu from "./screens/views/Asistencia/Menu";

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export default function Navigation () {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Login" >
                <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
                <Stack.Screen name="Clientes" component={Clientes}  options={{ title: "Clientes" , headerShown:false}} />
                <Stack.Screen name="Embarcaciones" component={EmbarcacionesScreen} />
                <Stack.Screen name="Trabajo" component={Trabajo} />
                <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }}/>
                <Stack.Screen name="QRScann" component={QRScann} options={{ title: "Escaneo de QR" }} />
                <Stack.Screen name="Menu" component={Menu} options={{ title: "Menú"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}