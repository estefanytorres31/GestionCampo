import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/views/Auth/Login";
import Clientes from "./screens/views/client/Client";
import Exalmar from "./screens/views/Embarcacion/Exalmar";
import Austral from "./screens/views/Embarcacion/Austral";
import Diamante from "./screens/views/Embarcacion/Diamante";
import Centinela from "./screens/views/Embarcacion/Centinela";
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
                <Stack.Screen name="Exalmar" component={Exalmar}  options={{ title: "Exalmar" }}/>
                <Stack.Screen name="Austral" component={Austral}  options={{ title: "Austral" }}/>
                <Stack.Screen name="Diamante" component={Diamante}  options={{ title: "Diamante" }}/>
                <Stack.Screen name="Centinela" component={Centinela}  options={{ title: "Centinela" }}/>
                <Stack.Screen name='SubcategoryScreen' component={SubcategoryScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}