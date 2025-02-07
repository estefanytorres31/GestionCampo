import React, { useEffect, useState } from "react";
import { View,Text,TouchableOpacity,StyleSheet,SafeAreaView,Animated,ScrollView,ActivityIndicator,Dimensions} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTipoTrabajoESP from "../../hooks/TipoTrabajoESP/useTipoTrabajoESP";

const { width, height } = Dimensions.get('window');

const SistemasScreen = ({ route, navigation }) => {
    const { empresa, embarcacion, trabajo } = route.params;
    const { 
        tipoTrabajosESP, 
        fetchTiposTrabajosESP 
    } = useTipoTrabajoESP();
    
    // Estado para manejar las selecciones
    const [selectedSistemas, setSelectedSistemas] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    
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

        const loadSistemas = async () => {
            try {
                await fetchTiposTrabajosESP(trabajo.id_tipo_trabajo, embarcacion.id_embarcacion);
            } catch (error) {
                console.error('Error cargando sistemas:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSistemas();
    }, []);

    const toggleSistemaSelection = (sistema) => {
        setSelectedSistemas(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(sistema.id_sistema)) {
                newSelected.delete(sistema.id_sistema);
            } else {
                newSelected.add(sistema.id_sistema);
            }
            return newSelected;
        });
    };

    const generarCodigoOT = (empresa, embarcacion, trabajo) => {
        const fecha = new Date();
        const utcOffset = fecha.getTimezoneOffset() * 60000; // Offset in milliseconds
        const peruOffset = -5 * 3600000; // Offset for Peru in milliseconds (-5 hours)
    
        const fechaPeru = new Date(fecha.getTime() + utcOffset + peruOffset);
        const dia = String(fechaPeru.getDate()).padStart(2, '0');
        const mes = String(fechaPeru.getMonth() + 1).padStart(2, '0');
        const año = fechaPeru.getFullYear();
    
        const horas = String(fechaPeru.getHours()).padStart(2, '0');
        const minutos = String(fechaPeru.getMinutes()).padStart(2, '0');
        const segundos = String(fechaPeru.getSeconds()).padStart(2, '0');
    
        const codigoEmpresa = empresa.nombre.slice(0, 4).toUpperCase();
    
        // Determinar el código de la embarcación
        let codigoEmbarcacion;
        const regexTasa = /^Tasa\s*(\d+)/i;
        const match = embarcacion.nombre.match(regexTasa);
    
        if (match) {
            codigoEmbarcacion = `T${match[1]}`;
        } else {
            codigoEmbarcacion = embarcacion.nombre.slice(0, 4).toUpperCase();
        }
    
        // Determinar el código del trabajo
        let codigoTrabajo;
        switch (trabajo.nombre_trabajo.toLowerCase()) {
            case "mantenimiento preventivo":
                codigoTrabajo = "RMPR";
                break;
            case "mantenimiento correctivo":
                codigoTrabajo = "RMCO";
                break;
            case "proyecto":
                codigoTrabajo = "RPRO";
                break;
            case "desmontaje/montaje":
                codigoTrabajo = "RDESM";
                break;
            default:
                codigoTrabajo = "RGEN"; 
                break;
        }
    
        // Construcción del código OT
        const codigoOT = `${codigoEmpresa}_${codigoEmbarcacion}_${codigoTrabajo}_${dia}${mes}${año}_${horas}${minutos}${segundos}`;
        return codigoOT;
    };
    
    


    const handleGuardarSeleccion = () => {
        const sistemasSeleccionados = tipoTrabajosESP.filter(sistema => 
            selectedSistemas.has(sistema.id_sistema)
        );

        if (sistemasSeleccionados.length === 0) {
            alert("Debe seleccionar al menos un sistema para generar la orden de trabajo.");
            return;
        }
        
        const codigoOT = generarCodigoOT(empresa, embarcacion, trabajo);
        console.log("Código de la orden de trabajo:", codigoOT);
        
        // Aquí puedes navegar a la siguiente pantalla o guardar la selección
        navigation.navigate("Asignar", { 
            sistemas: sistemasSeleccionados,
            empresa,
            embarcacion,
            trabajo,
            codigoOT 
        });
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                    <Text style={styles.loadingText}>Cargando sistemas...</Text>
                </View>
            );
        }

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
                {tipoTrabajosESP.map((sistema) => (
                    <TouchableOpacity
                        key={sistema.id_sistema}
                        style={[
                            styles.sistemaCard,
                            selectedSistemas.has(sistema.id_sistema) && styles.sistemaCardSelected
                        ]}
                        onPress={() => toggleSistemaSelection(sistema)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.sistemaContent}>
                            <View style={styles.checkboxContainer}>
                                <MaterialCommunityIcons
                                    name={selectedSistemas.has(sistema.id_sistema) 
                                        ? "checkbox-marked-circle"
                                        : "checkbox-blank-circle-outline"}
                                    size={24}
                                    color={selectedSistemas.has(sistema.id_sistema) ? "#2E7D32" : "#666"}
                                />
                            </View>
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
                    <Text style={styles.headerTitle}>
                        {embarcacion.nombre} - {trabajo.nombre_trabajo}
                    </Text>
                    <Text style={styles.selectionText}>
                        Seleccionados: {selectedSistemas.size}
                    </Text>
                </View>

                {renderContent()}

                {tipoTrabajosESP && tipoTrabajosESP.length > 0 && (
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={[
                                styles.guardarButton,
                                selectedSistemas.size === 0 && styles.guardarButtonDisabled
                            ]}
                            onPress={handleGuardarSeleccion}
                            disabled={selectedSistemas.size === 0}
                        >
                            <Text style={styles.guardarButtonText}>
                                Guardar Selección ({selectedSistemas.size})
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        fontSize: 18,
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
    sistemaCardSelected: {
        backgroundColor: "#E8F5E9",
        borderColor: "#2E7D32",
        borderWidth: 1,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    bottomContainer: {
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    guardarButton: {
        backgroundColor: "#2E7D32",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    guardarButtonDisabled: {
        backgroundColor: "#ccc",
    },
    guardarButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    selectionText: {
        fontSize: 14,
        color: "black",
        marginTop: 5,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
        fontSize: 16,
    },
});

export default SistemasScreen;