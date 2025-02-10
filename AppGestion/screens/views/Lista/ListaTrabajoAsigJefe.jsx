import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    ScrollView, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity,
    Dimensions,
    StatusBar
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import useOrdenTrabajo from "../../hooks/OrdenTrabajo/useOrdenTrabajo";

const { width } = Dimensions.get('window');

const OrdenesTrabajoScreen = ({ navigation }) => {
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
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Cargando órdenes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#EF4444" />
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.header}>
                <MaterialCommunityIcons name="clipboard-list-outline" size={40} color="white" />
                <Text style={styles.title}>Órdenes de Trabajo</Text>
                <Text style={styles.subtitle}>{ordenes.length} órdenes asignadas</Text>
            </LinearGradient>

            {ordenes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="clipboard-outline" size={80} color="#9CA3AF" />
                    <Text style={styles.noData}>No hay órdenes de trabajo asignadas</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    {ordenes.map((item) => (
                        <TouchableOpacity 
                            key={item.id_orden_trabajo}
                            style={styles.card}
                            onPress={() => navigation.navigate('DetallesOrdenTrabajo', { ordenTrabajo: item })}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.codigo}>{item.codigo}</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.infoText}>Fecha: {new Date(item.fecha_asignacion).toLocaleDateString()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    subtitle: { fontSize: 16, color: 'white' },
    listContainer: { padding: 16 },
    card: { backgroundColor: '#FFF', padding: 16, marginBottom: 10, borderRadius: 8 },
    codigo: { fontSize: 16, fontWeight: "bold", color: "#6366F1" },
    cardContent: { padding: 8 },
    infoText: { fontSize: 14, color: "#374151" },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16, color: "#6366F1" },
    error: { color: "#EF4444", fontSize: 16, textAlign: "center", padding: 24 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    noData: { fontSize: 18, color: "#9CA3AF", textAlign: "center" },
});

export default OrdenesTrabajoScreen;
