// Trabajo.js
import React, { useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated,
    Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import useTipoTrabajo from "../../hooks/TipoTrabajo/useTipoTabajo";

const { height } = Dimensions.get('window');

const Trabajo = ({ navigation }) => {
    const { tipotrabajos } = useTipoTrabajo(); // Obtén los tipos de trabajo del contexto
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

    const handleButtonPress = (screen) => {
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

        navigation.navigate(screen, { clase: 'algún valor' });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.subtitle}>Selecciona un tipo de trabajo</Text>
                </View>

                <View style={styles.buttonContainer}>
                    {tipotrabajos.length > 0 ? (
                        tipotrabajos.map((trabajo, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.button, { backgroundColor: '#7fa23d' }]} // Ejemplo de estilo
                                onPress={() => handleButtonPress(trabajo.nombre_trabajo)} // Asume que 'nombre' es el campo del tipo de trabajo
                                activeOpacity={0.8}
                            >
                                <View style={styles.buttonContent}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="boat-outline" size={28} color="white" />
                                    </View>
                                    <Text style={styles.buttonText}>{trabajo.nombre_trabajo}</Text>
                                    <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No hay tipos de trabajo disponibles</Text>
                    )}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    headerContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
        letterSpacing: 0.5,
        flex: 1,
        marginLeft: 15,
    },
});

export default Trabajo;
