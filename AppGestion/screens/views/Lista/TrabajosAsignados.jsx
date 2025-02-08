import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator,
    Dimensions,
    Animated 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTrabajoAsignado from "../../hooks/TrabajoAsignado/useTrabajoAsignado";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TrabajosAsignadosScreen = ({ navigation }) => {
    const { trabajos, loading, error, fetchTrabajosAsignados } = useTrabajoAsignado();

    useEffect(() => {
        fetchTrabajosAsignados();
    }, []);

    const handleTrabajoPress = (idOrden) => {
        navigation.navigate("Mantto", { idOrden });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Cargando trabajos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <MaterialCommunityIcons name="alert-circle" size={50} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={fetchTrabajosAsignados}
                >
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.retryText}>Reintentar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <MaterialCommunityIcons name="clipboard-list" size={50} color="#fff" />
                    <Text style={styles.headerTitle}>Trabajos Asignados</Text>
                    <Text style={styles.headerSubtitle}>Seleccione un trabajo para comenzar</Text>
                </View>
            </LinearGradient>

            <View style={styles.buttonsContainer}>
                {trabajos.map((trabajo, index) => (
                    <TouchableOpacity
                        key={trabajo.id_orden_trabajo}
                        style={[styles.card, { marginTop: index === 0 ? -50 : 0 }]}
                        onPress={() => handleTrabajoPress(trabajo.id_orden_trabajo)}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="wrench" size={32} color="#3B82F6" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardTitle}>{trabajo.nombre_trabajo}</Text>
                                <Text style={styles.cardSubtitle}>Toque para ver detalles</Text>
                            </View>
                            <MaterialCommunityIcons 
                                name="chevron-right" 
                                size={24} 
                                color="#3B82F6" 
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 80,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    header: {
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 15,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#fff",
        opacity: 0.9,
        marginTop: 5,
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        marginVertical: 8,
        borderRadius: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    iconContainer: {
        backgroundColor: '#EBF5FF',
        padding: 12,
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1F2937",
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 2,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        marginTop: 15,
        color: "#6B7280",
    },
    errorText: {
        fontSize: 16,
        color: "#EF4444",
        marginTop: 10,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        overflow: 'hidden',
        borderRadius: 10,
    },
    gradientButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    retryText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default TrabajosAsignadosScreen;