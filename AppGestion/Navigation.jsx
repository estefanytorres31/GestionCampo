import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import Clientes from "./screens/views/client/Client";
import EmbarcacionesScreen from "./screens/views/Embarcacion/Embarcacion";
import Trabajo from "./screens/views/TipoTrabajo/TipoTrabajo";

import SubcategoryScreen from "./screens/components/Subcategoria";

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
            </Stack.Navigator>
        </NavigationContainer>
    );
}