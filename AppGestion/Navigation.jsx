import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import ClientScreen from "./screens/views/client/Client";
import EmbarcacionesScreen from "./screens/views/embarcacion/Embarcacion";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export default function Navigation () {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Login"  screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Clientes" component={ClientScreen}  options={{ title: Clientes }} />
                <Stack.Screen name="Exalmar" component={EmbarcacionesScreen}  options={{ title: Exalmar }}
             />
            </Stack.Navigator>
        </NavigationContainer>
    );
}