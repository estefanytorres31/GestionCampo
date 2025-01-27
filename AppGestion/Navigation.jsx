import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import ClientScreen from "./screens/client/Client";

const Stack = createNativeStackNavigator();

export default function Navigation () {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Clientes"  screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Clientes" component={ClientScreen}  options={{ headerShown: true }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}