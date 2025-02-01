import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView 
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SeleccionarRol = ({ route, navigation }) => {
    const { roles } = route.params;

    const handleRoleSelection = (role) => {
        switch (role) {
            case 'Administrador':
                navigation.replace('Clientes');
                break;
            case 'Técnico':
                navigation.replace('TrabajosAsignados');
                break;
            default:
                navigation.replace('Login');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#1A2980", "#26D0CE"]}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Selecciona tu rol</Text>
                    {roles.map((role, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.button} 
                            onPress={() => handleRoleSelection(role)}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons 
                                name="account-circle" 
                                size={24} 
                                color="white" 
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>{role}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 36,
        letterSpacing: 0.5,
    },
    button: {
        backgroundColor: '#353535',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 16,
        marginVertical: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default SeleccionarRol;