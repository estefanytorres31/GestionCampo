import React, { useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Animated, 
    ScrollView 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const trabajosAsignados = [
    { id: 1, nombre: "Revisión de motor" },
    { id: 2, nombre: "Mantenimiento preventivo" },
    { id: 3, nombre: "Reparación eléctrica" },
    { id: 4, nombre: "Cambio de aceite" },
];

const TrabajosAsignadosScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleTrabajoPress = (trabajo) => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
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

        navigation.navigate("Inicio", { trabajo });
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="clipboard-list" size={40} color="#2E7D32" />
                <Text style={styles.headerTitle}>Trabajos Asignados</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.buttonsContainer}>
                    {trabajosAsignados.map((trabajo) => (
                        <TouchableOpacity
                            key={trabajo.id}
                            style={styles.button}
                            onPress={() => handleTrabajoPress(trabajo)}
                        >
                            <View style={styles.buttonContent}>
                                <MaterialCommunityIcons name="wrench" size={32} color="#fff" />
                                <Text style={styles.buttonText}>{trabajo.nombre}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={24} color="#ffffff80" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6F8",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2E7D32",
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
    },
    buttonsContainer: {
        paddingBottom: 20,
    },
    button: {
        backgroundColor: "#2E7D32",
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 4,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    buttonText: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 15,
    },
});

export default TrabajosAsignadosScreen;
