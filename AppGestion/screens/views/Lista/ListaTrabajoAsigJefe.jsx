import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import useOrdenTrabajo from "../../hooks/OrdenTrabajo/useOrdenTrabajo";

const OrdenesTrabajoScreen = ({ navigation }) => {  // Asegúrate de pasar `navigation` como prop
    const { obtenerTrabajosPorJefeAsig, loading, error } = useOrdenTrabajo();
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        const cargarOrdenes = async () => {
            const data = await obtenerTrabajosPorJefeAsig();
            if (data) {
                setOrdenes(data);
            }
        };
        cargarOrdenes();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    const handleDetailsPress = (item) => {
        // Aquí puedes navegar a una pantalla de detalles
        navigation.navigate('DetallesOrdenTrabajo', { ordenTrabajo: item });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Órdenes de Trabajo</Text>
            {ordenes.length === 0 ? (
                <Text style={styles.noData}>No hay órdenes de trabajo asignadas.</Text>
            ) : (
                <FlatList
                    data={ordenes}
                    keyExtractor={(item) => item.id_orden_trabajo.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.codigo}>Código: {item.codigo}</Text>
                            <Text>Motorista: {item.motorista}</Text>
                            <Text>Supervisor: {item.supervisor}</Text>
                            <Text>ID Tipo Trabajo: {item.id_tipo_trabajo}</Text>

                            <TouchableOpacity style={styles.detailsButton} onPress={() => handleDetailsPress(item)}>
                                <Text style={styles.detailsButtonText}>Ver detalles</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    noData: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    codigo: {
        fontSize: 18,
        fontWeight: "bold",
    },
    detailsButton: {
        marginTop: 10,
        paddingVertical: 8,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
    },
    detailsButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default OrdenesTrabajoScreen;
