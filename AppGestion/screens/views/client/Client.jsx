import React, { useEffect, useContext } from "react"; 
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    Dimensions,
    Animated 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from '@react-navigation/native';
import useEmpresa from "../../hooks/Empresa/useEmpresa";
import useAuth from '../../hooks/Auth/useAuth';

const { height, width } = Dimensions.get('window');

// Definición ordenada de clientes con sus colores personalizados
const clientesOrdenados = [
    { id: '1', nombre: 'Tasa', color: '#00A3E0' },     // Azul moderno
    { id: '2', nombre: 'Exalmar', color: '#FF6B6B' },  // Coral vibrante
    { id: '3', nombre: 'Austral', color: '#4CAF50' },  // Verde fresco
    { id: '4', nombre: 'Diamante', color: '#7E57C2' }, // Púrpura elegante
    { id: '5', nombre: 'Centinela', color: '#FF9800' } // Naranja cálido
];

const ClientScreen = ({ navigation }) => {
    const { empresas } = useEmpresa();
    const { logout } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 45,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleButtonPress = (empresa) => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.97,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        navigation.navigate('Embarcaciones', { empresa });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#ffffff", "#f8f9fa"]}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Animated.View 
                    style={[styles.contentContainer, { 
                        opacity: fadeAnim, 
                        transform: [{ scale: scaleAnim }] 
                    }]}
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.subtitle}>Selecciona un cliente</Text>
                        <View style={styles.subtitleLine} />
                    </View>

                    <View style={styles.buttonContainer}>
                        {clientesOrdenados.map((cliente, index) => (
                            <Animated.View
                                key={cliente.id}
                                style={{
                                    transform: [{
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50 * (index + 1), 0]
                                        })
                                    }]
                                }}
                            >
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: cliente.color }]}
                                    onPress={() => handleButtonPress(cliente)}
                                    activeOpacity={0.85}
                                >
                                    <View style={styles.buttonContent}>
                                        <View style={styles.iconContainer}>
                                            <Ionicons name="boat-outline" size={28} color="white" />
                                        </View>
                                        <Text style={styles.buttonText}>{cliente.nombre}</Text>
                                        <View style={styles.arrowContainer}>
                                            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.9)" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        marginTop: height * 0.05,
        marginBottom: height * 0.04,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2d3436',
        fontFamily: 'System',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    subtitleLine: {
        width: 40,
        height: 4,
        backgroundColor: '#00A3E0',
        borderRadius: 2,
        marginTop: 8,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 8,
    },
    button: {
        marginVertical: 8,
        borderRadius: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: height * 0.022,
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
        letterSpacing: 0.5,
    },
    arrowContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 4,
    }
});

export default ClientScreen;