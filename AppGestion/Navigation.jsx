import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import ClientScreen from "./screens/client/Client";
import EmbarcacionesScreen from "./screens/embarcacion/Embarcacion";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export default function Navigation () {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Exalmar"  screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Clientes" component={ClientScreen}  options={{ headerShown: true }} />
                <Stack.Screen name="Exalmar" component={EmbarcacionesScreen}  options={{
                headerShown: true,
                headerTitle: "Exalmar",
                headerLeft: () => (
                <Ionicons name="chevron-back" size={24} color="black" />
                ),
                }}
             />
            </Stack.Navigator>
        </NavigationContainer>
    );
}