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

// Colores que se asignarán dinámicamente a los botones
const coloresBotones = ['#08789a', '#08897B','#2E7D32', '#C9921F','#1965C0'];

const ClientScreen = ({ navigation }) => {
    const { empresas } = useEmpresa();
    const { logout } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

    
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleButtonPress = (empresa, index) => {
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

        const empresaConColor = {
            ...empresa,
            color: coloresBotones[index % coloresBotones.length]
        };

        navigation.navigate('Embarcaciones', { empresa: empresaConColor });
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
                    style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.subtitle}>Selecciona un cliente</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {empresas.length > 0 ? (
                            empresas.map((empresa, index) => (
                                <Animated.View
                                key={empresa.id}
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
                                    key={empresa.id || index}
                                    style={[styles.button, { backgroundColor: coloresBotones[index % coloresBotones.length] }]} // Asignación dinámica de color
                                    onPress={() => handleButtonPress(empresa, index)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.buttonContent}>
                                        <View style={styles.iconContainer}>
                                            <Ionicons name="boat-outline" size={28} color="white" />
                                        </View>
                                        <Text style={styles.buttonText}>{empresa.nombre}</Text>
                                        <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                                    </View>
                                </TouchableOpacity>
                                </Animated.View>
                            ))
                        ) : (
                            <Text style={styles.loadingText}>Cargando empresas...</Text>
                        )}
                    </View>

                    <View style={styles.footerContainer}>
                    </View>
                </Animated.View>
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
    },
    contentContainer: {
        flex: 1,
        padding: 0.1,
        justifyContent: 'space-between',
    },
    headerContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2d3436',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#636e72',
        textAlign: 'center',
    },
    buttonContainer: {
        flex: 0.6,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    button: {
        marginVertical: 10,
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: height * 0.022,
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
        marginLeft: 15,
    },
    loadingText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#636e72",
    },
    footerContainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#EB1111",
    },
});

export default ClientScreen;