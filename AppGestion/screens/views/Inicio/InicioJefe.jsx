import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions,
    StatusBar,
    Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useAuth from "../../hooks/Auth/useAuth";

const { width, height } = Dimensions.get("window");

const JefeScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogout = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            logout();
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={["#4F46E5", "#7C3AED", "#2D3748"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Animated.View style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY }]
                    }
                ]}>
                    <View style={styles.headerContainer}>
                        <View style={styles.iconBackground}>
                            <Ionicons name="grid" size={40} color="#4F46E5" />
                        </View>
                        <Text style={styles.title}>Panel de Control</Text>
                        <Text style={styles.subtitle}>Gestión y Administración</Text>
                    </View>

                    <View style={styles.cardsContainer}>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.card, styles.cardPrimary]}
                                onPress={() => navigation.navigate("Clientes")}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: "#EEF2FF" }]}>
                                    <Ionicons name="clipboard-outline" size={30} color="#4F46E5" />
                                </View>
                                <Text style={styles.cardTitle}>Asignar OT</Text>
                                <Text style={styles.cardSubtitle}>Gestionar órdenes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.card, styles.cardSecondary]}
                                onPress={() => navigation.navigate("QRScann")}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: "#F0FDF4" }]}>
                                    <Ionicons name="qr-code-outline" size={30} color="#22C55E" />
                                </View>
                                <Text style={styles.cardTitle}>Embarcación</Text>
                                <Text style={styles.cardSubtitle}>Escaneo de QR</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.card, styles.cardTertiary]}
                                onPress={() => navigation.navigate("ListaOTAsignado")}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: "#FDF4FF" }]}>
                                    <Ionicons name="list" size={30} color="#D946EF" />
                                </View>
                                <Text style={styles.cardTitle}>Lista OT</Text>
                                <Text style={styles.cardSubtitle}>OT asignados</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.card, styles.cardQuaternary]}
                                onPress={() => navigation.navigate("TrabajosAsignados")}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: "#FEF2F2" }]}>
                                    <Ionicons name="document-text" size={30} color="#EF4444" />
                                </View>
                                <Text style={styles.cardTitle}>Mis OT</Text>
                                <Text style={styles.cardSubtitle}>Trabajos activos</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={["#991B1B", "#DC2626"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.logoutGradient}
                        >
                            <Ionicons name="log-out-outline" size={24} color="white" />
                            <Text style={styles.logoutText}>Cerrar Sesión</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 30,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "white",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 8,
    },
    cardsContainer: {
        flex: 1,
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    card: {
        width: width * 0.42,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "white",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardPrimary: {
        borderLeftWidth: 4,
        borderLeftColor: "#4F46E5",
    },
    cardSecondary: {
        borderLeftWidth: 4,
        borderLeftColor: "#22C55E",
    },
    cardTertiary: {
        borderLeftWidth: 4,
        borderLeftColor: "#D946EF",
    },
    cardQuaternary: {
        borderLeftWidth: 4,
        borderLeftColor: "#EF4444",
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#6B7280",
    },
    logoutButton: {
        marginTop: 20,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoutGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    logoutText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
    },
});

export default JefeScreen;
