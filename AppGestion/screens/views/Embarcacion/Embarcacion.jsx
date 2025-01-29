import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Animated,
    Dimensions,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useEmbarcacion from "../../hooks/Embarcacion/useEmbarcacion";

const { width } = Dimensions.get('window');

const EmbarcacionesScreen = ({ route, navigation }) => {
    const { empresa } = route.params;
    const { embarcaciones, loading, error, fetchEmbarcacionesByEmpresa } = useEmbarcacion();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

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
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Cargar embarcaciones
        fetchEmbarcacionesByEmpresa(empresa.id);
    }, []);

    const handleEmbarcacionPress = (embarcacion) => {
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

        navigation.navigate("DetalleEmbarcacion", { embarcacion });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={empresa.color || '#2E7D32'} />
                    <Text style={styles.loadingText}>Cargando embarcaciones...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={[styles.retryButton, { backgroundColor: empresa.color || '#2E7D32' }]}
                        onPress={() => fetchEmbarcacionesByEmpresa(empresa.id)}
                    >
                        <Text style={styles.retryText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!embarcaciones || embarcaciones.length === 0) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No hay embarcaciones disponibles</Text>
                </View>
            );
        }

        return (
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.buttonsContainer}>
                    {embarcaciones.map((embarcacion, index) => (
                        <TouchableOpacity
                            key={embarcacion.id_embarcacion}
                            style={[styles.button, { backgroundColor: empresa.color || '#2E7D32' }]}
                            onPress={() => handleEmbarcacionPress(embarcacion)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.buttonContent}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons 
                                        name={index % 2 === 0 ? "anchor" : "ship-wheel"} 
                                        size={32} 
                                        color="#fff" 
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.buttonText}>{embarcacion.nombre}</Text>
                                    <MaterialCommunityIcons 
                                        name="chevron-right" 
                                        size={24} 
                                        color="#ffffff80" 
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <Animated.View 
            style={[styles.container, { 
                opacity: fadeAnim, 
                transform: [{ scale: scaleAnim }] 
            }]}
        >
            <View style={styles.header}>
                <MaterialCommunityIcons 
                    name="anchor" 
                    size={40} 
                    color={empresa.color || '#2E7D32'} 
                    style={styles.headerIcon} 
                />
                <Text style={[styles.headerTitle, { color: empresa.color || '#2E7D32' }]}>
                    {empresa.nombre}
                </Text>
                <Text style={styles.headerSubtitle}>Seleccione una embarcación</Text>
            </View>

            {renderContent()}
        </Animated.View>
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
        paddingHorizontal: 20,
    },
    headerIcon: {
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#5c6bc0",
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    buttonsContainer: {
        paddingHorizontal: 16,
    },
    button: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.5,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#636e72",
        marginTop: 10,
    },
    errorText: {
        fontSize: 16,
        color: "#d63031",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: "#636e72",
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    retryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default EmbarcacionesScreen;