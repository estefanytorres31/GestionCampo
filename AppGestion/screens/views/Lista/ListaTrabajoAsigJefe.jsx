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
import useEmpresa from "../../hooks/Empresa/useEmpresa";
import useEmbarcacion from "../../hooks/Embarcacion/useEmbarcacion";
import Filtrado from "../../components/Filtrado"

const { width } = Dimensions.get('window');

const getEstadoConfig = (estado) => {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return {
                backgroundColor: '#FEF3C7',
                textColor: '#D97706',
                icon: 'clock-outline',
                label: 'Pendiente'
            };
        case 'en_progreso':
            return {
                backgroundColor: '#DBEAFE',
                textColor: '#2563EB',
                icon: 'progress-clock',
                label: 'En Progreso'
            };
            case 'reasignado':
                return {
                    backgroundColor: '#E0E7FF',
                    textColor: '#9da7ac',
                    icon: 'swap-horizontal',
                    label: 'Reasignado'
                };
        case 'completado':
            return {
                backgroundColor: '#DEF7EC',
                textColor: '#059669',
                icon: 'check-circle-outline',
                label: 'Completado'
            };
        default:
            return {
                backgroundColor: '#E5E7EB',
                textColor: '#6B7280',
                icon: 'help-circle-outline',
                label: estado
            };
    }
};

const EstadoBadge = ({ estado }) => {
    const config = getEstadoConfig(estado);

    return (
        <View style={[styles.estadoBadge, { backgroundColor: config.backgroundColor }]}>
            <MaterialCommunityIcons 
                name={config.icon} 
                size={16} 
                color={config.textColor} 
                style={styles.estadoIcon}
            />
            <Text style={[styles.estadoText, { color: config.textColor }]}>
                {config.label}
            </Text>
        </View>
    );
};

const OrdenesTrabajoScreen = ({ navigation }) => {
    const { obtenerTrabajosPorJefeAsig, loading, error, obtenerTrabajosPorEmbarcacion } = useOrdenTrabajo();
    const [ordenes, setOrdenes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState(null);
    const {empresas}=useEmpresa();
    const {fetchEmbarcacionesByEmpresa}=useEmbarcacion();
    const [filteredOrdenes, setFilteredOrdenes] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        empresa: null,
        embarcacion: null
    });

    useEffect(() => {
        const cargarOrdenes = async() => {
            const data = await obtenerTrabajosPorJefeAsig();
            if (data) {
                setOrdenes(data);
            }
        };
        cargarOrdenes();
    }, []);

    const filtrarPorEstado = (estado) => {
        setFiltroEstado(filtroEstado === estado ? null : estado);
    };

    const handleOrdersFiltered = (filtered) => {
        setFilteredOrdenes(filtered);
        const isFiltering = filtered.length !== ordenes.length;
        if (!isFiltering) {
            setActiveFilters({ empresa: null, embarcacion: null });
        }
    };
    

    const ordenesFiltradas = filtroEstado
        ? ordenes.filter(orden => orden.estado.toLowerCase() === filtroEstado.toLowerCase())
        : ordenes;

    const handleReasignarPress = (item) => {
        navigation.navigate('Asignar', {
            codigoOT: item.codigo,
            idOrden:item.id_orden_trabajo,
            ordenTrabajo:item
        });
    };


    const renderItem = (item) => (
        <TouchableOpacity 
            key={item.id_orden_trabajo}
            style={styles.card}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.codeContainer}>
                    <Text style={styles.codigo}>{item.codigo}</Text>
                </View>
                <EstadoBadge estado={item.estado} />
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="#6366F1" />
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Fecha: </Text>
                        {new Date(item.fecha_asignacion).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {['pendiente', 'en_progreso'].includes(item.estado.toLowerCase()) && (
                <TouchableOpacity 
                    style={[
                        styles.reasignarButton,
                        { backgroundColor: getEstadoConfig(item.estado).backgroundColor }
                    ]}
                    onPress={() => handleReasignarPress(item)}
                >
                    {<MaterialCommunityIcons 
                        name="arrow-right-thick" 
                        size={20} 
                        color={getEstadoConfig(item.estado).textColor} 
                    /> }
                    {<Text style={[
                        styles.reasignarButtonText, 
                        { color: getEstadoConfig(item.estado).textColor }
                    ]}>
                        Siguiente
                    </Text>}
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

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

        // Custom message based on whether there are active filters
        const getNoResultsMessage = () => {
            if (activeFilters.embarcacion) {
                return "No se encontraron OT de esa embarcación";
            }
            if (activeFilters.empresa) {
                return "No se encontraron OT de esa empresa";
            }
            return "No se encontraron órdenes con los filtros seleccionados";
        };
    
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loadingText}>Cargando órdenes...</Text>
                </View>
            );
        }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {ordenes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="clipboard-outline" size={80} color="#9CA3AF" />
                    <Text style={styles.noData}>No hay órdenes de trabajo asignadas</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {renderHeader()}
                    <Filtrado 
                        empresas={empresas}
                        ordenes={ordenes}
                        fetchEmbarcacionesByEmpresa={fetchEmbarcacionesByEmpresa}
                        onOrdersFiltered={handleOrdersFiltered}
                    />
                  {filteredOrdenes.length > 0 ? (
                        filteredOrdenes.map(renderItem)
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <MaterialCommunityIcons name="filter-off" size={60} color="#9CA3AF" />
                            <Text style={styles.noResultsText}>{getNoResultsMessage()}</Text>
                        </View>
                    )}                
                </ScrollView>
            )}
        </View>
    );
};

    const styles = StyleSheet.create({
        // Existing styles...
        reasignarButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
        },
        reasignarButtonText: {
            fontSize: 16,
            fontWeight: "600",
            marginLeft: 8,
        },
        codeContainer: {
            backgroundColor: "#EEF2FF",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
        },
        codigo: {
            fontSize: 15,
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
        estadoBadge: {
            flexDirection: 'row',
            flexWrap:'wrap',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },
        estadoIcon: {
            marginRight: 4,
        },
        estadoText: {
            fontSize: 14,
            fontWeight: '600',
        },
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
            flexWrap: 'wrap', // Permite que los elementos se envuelvan si no hay espacio
            gap: 8, // Espacio entre elementos
        },
        noData: {
            fontSize: 18,
            color: "#9CA3AF",
            marginTop: 16,
            textAlign: "center",
        },
        noResultsContainer: {
            padding: 40,
            alignItems: 'center',
        },
        noResultsText: {
            fontSize: 16,
            color: "#6B7280",
            marginTop: 16,
            textAlign: "center",
        },
    });


export default OrdenesTrabajoScreen;