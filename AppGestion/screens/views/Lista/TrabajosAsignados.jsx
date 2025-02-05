import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTrabajoAsignado from "../../hooks/TrabajoAsignado/useTrabajoAsignado";

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
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.loadingText}>Cargando trabajos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchTrabajosAsignados}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="clipboard-list" size={40} color="#2E7D32" />
                <Text style={styles.headerTitle}>Trabajos Asignados</Text>
                <Text style={styles.headerSubtitle}>Seleccione un trabajo</Text>
            </View>

            <View style={styles.buttonsContainer}>
                {trabajos.map((trabajo) => (
                    <TouchableOpacity
                        key={trabajo.id_orden_trabajo}
                        style={styles.button}
                        onPress={() => handleTrabajoPress(trabajo.id_orden_trabajo)}
                    >
                        <View style={styles.buttonContent}>
                            <MaterialCommunityIcons name="wrench" size={32} color="#fff" />
                            <Text style={styles.buttonText}>{trabajo.nombre_trabajo}</Text>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#ffffff80" />
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
        backgroundColor: "#F5F6F8",
    },
    header: {
        alignItems: "center",
        marginVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
    },
    buttonsContainer: {
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: "#2E7D32",
        marginVertical: 8,
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "space-between",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        marginTop: 10,
        color: "#555",
    },
    errorText: {
        fontSize: 16,
        color: "red",
    },
    retryButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#2E7D32",
        borderRadius: 5,
    },
    retryText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default TrabajosAsignadosScreen;
