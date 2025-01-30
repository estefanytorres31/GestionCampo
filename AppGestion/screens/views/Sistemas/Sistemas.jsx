import React, { useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated,
    ScrollView,
    ActivityIndicator,
    Dimensions
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTipoTrabajoESP from "../../hooks/TipoTrabajoESP/useTipoTrabajoESP";

const { width, height } = Dimensions.get('window');

const SistemasScreen = ({ route, navigation }) => {
    const { embarcacion, trabajo } = route.params;
    const { 
        tipoTrabajosESP, 
        fetchTiposTrabajosESP 
    } = useTipoTrabajoESP();
    
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        // Iniciar animaciones
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Cargar sistemas
        fetchTiposTrabajosESP(trabajo.id_tipo_trabajo, embarcacion.id_embarcacion);
    }, []);

    const handleSistemaPress = (sistema) => {
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

        // Navegar a la siguiente pantalla con los detalles del sistema
        navigation.navigate("DetallesSistema", { sistema });
    };

    const renderContent = () => {
        if (!tipoTrabajosESP || tipoTrabajosESP.length === 0) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>
                        No hay sistemas disponibles para esta embarcación y tipo de trabajo
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tipoTrabajosESP.map((sistema, index) => (
                    <TouchableOpacity
                        key={sistema.id_sistema}
                        style={styles.sistemaCard}
                        onPress={() => handleSistemaPress(sistema)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sistemaContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="cog-outline"
                                    size={32}
                                    color="#2E7D32"
                                />
                            </View>
                            <View style={styles.sistemaInfo}>
                                <Text style={styles.sistemaNombre}>
                                    {sistema.nombre_sistema}
                                </Text>
                                <Text style={styles.sistemaDescripcion}>
                                    {sistema.descripcion || 'Sin descripción'}
                                </Text>
                            </View>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={24}
                                color="#2E7D32"
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sistemas</Text>
                    <Text style={styles.headerSubtitle}>
                        {embarcacion.nombre} - {trabajo.nombre_trabajo}
                    </Text>
                </View>

                {renderContent()}
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F6F8",
    },
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#2E7D32",
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    sistemaCard: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    sistemaContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    sistemaInfo: {
        flex: 1,
    },
    sistemaNombre: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2E7D32",
        marginBottom: 4,
    },
    sistemaDescripcion: {
        fontSize: 14,
        color: "#666",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});

export default SistemasScreen;