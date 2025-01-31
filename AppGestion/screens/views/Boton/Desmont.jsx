import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Wrench, Unplug } from 'lucide-react';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mantenimiento</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.desmontajeButton]} 
          onPress={() => navigation.navigate('Montaje')}
        >
          <Unplug color="white" size={24} />
          <Text style={styles.buttonText}>Desmontajes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.montajeButton]} 
          onPress={() => navigation.navigate('Montaje')}
        >
          <Wrench color="white" size={24} />
          <Text style={styles.buttonText}>Montaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MontajeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Montaje</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Montaje" component={MontajeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  desmontajeButton: {
    backgroundColor: '#3498db',
  },
  montajeButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;