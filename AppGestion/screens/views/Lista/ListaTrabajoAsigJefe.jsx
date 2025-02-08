import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    FlatList, 
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

    const handleDetailsPress = (item) => {
        navigation.navigate('DetallesOrdenTrabajo', { ordenTrabajo: item });
    };

    const renderHeader = () => (
        <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.header}
        >
            <MaterialCommunityIcons name="clipboard-list-outline" size={40} color="white" />
            <Text style={styles.title}>Órdenes de Trabajo</Text>
            <Text style={styles.subtitle}>
                {ordenes.length} {ordenes.length === 1 ? 'orden asignada' : 'órdenes asignadas'}
            </Text>
        </LinearGradient>
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => handleDetailsPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.codeContainer}>
                    <Text style={styles.codigo}>{item.codigo}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#6366F1" />
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-tie" size={20} color="#6366F1" />
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Supervisor: </Text>
                        {item.supervisor}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="truck-delivery" size={20} color="#6366F1" />
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Motorista: </Text>
                        {item.motorista}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="format-list-numbered" size={20} color="#6366F1" />
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>ID Trabajo: </Text>
                        {item.id_tipo_trabajo}
                    </Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => handleDetailsPress(item)}
            >
                <Text style={styles.detailsButtonText}>Ver detalles</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {ordenes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="clipboard-outline" size={80} color="#9CA3AF" />
                    <Text style={styles.noData}>No hay órdenes de trabajo asignadas</Text>
                </View>
            ) : (
                <FlatList
                    data={ordenes}
                    keyExtractor={(item) => item.id_orden_trabajo.toString()}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F3F4F6",
    },
    header: {
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "white",
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    codeContainer: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    codigo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6366F1",
    },
    cardContent: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        marginLeft: 12,
        fontSize: 15,
        color: "#374151",
    },
    infoLabel: {
        fontWeight: "600",
        color: "#4B5563",
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#6366F1",
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    detailsButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noData: {
        fontSize: 18,
        color: "#9CA3AF",
        marginTop: 16,
        textAlign: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6366F1",
    },
    error: {
        color: "#EF4444",
        fontSize: 16,
        marginTop: 12,
        textAlign: "center",
        paddingHorizontal: 24,
    },
});

export default OrdenesTrabajoScreen;