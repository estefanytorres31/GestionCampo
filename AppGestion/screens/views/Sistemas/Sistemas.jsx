import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, ScrollView, ActivityIndicator, Dimensions } from "react-native";
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
                    <View style={styles.badge}>
                        <Text style={styles.selectionText}>
                            {selectedSistemas.size} seleccionados
                        </Text>
                    </View>
                </View>

                {renderContent()}

                {tipoTrabajosESP && tipoTrabajosESP.length > 0 && (
                    <Animated.View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={[
                                styles.guardarButton,
                                selectedSistemas.size === 0 && styles.guardarButtonDisabled
                            ]}
                            onPress={handleGuardarSeleccion}
                            disabled={selectedSistemas.size === 0}
                        >
                            <MaterialCommunityIcons 
                                name="content-save-outline" 
                                size={24} 
                                color="#fff" 
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.guardarButtonText}>
                                Guardar Selección ({selectedSistemas.size})
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        backgroundColor: '#7da578',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#f3fff3",
        marginBottom: 12,
        textAlign: "center",
    },
    badge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectionText: {
        fontSize: 14,
        color: "#2E7D32",
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sistemaCard: {
        backgroundColor: "#FFFF",
        borderRadius: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        transform: [{ scale: 1 }],
    },
    sistemaContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
        shadowColor: "#2E7D32",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sistemaInfo: {
        flex: 1,
    },
    sistemaNombre: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1B5E20",
        marginBottom: 8,
    },
    sistemaDescripcion: {
        fontSize: 15,
        color: "#546E7A",
        lineHeight: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "#546E7A",
        textAlign: "center",
        lineHeight: 24,
    },
    sistemaCardSelected: {
        backgroundColor: "#E8F5E9",
        borderColor: "#2E7D32",
        borderWidth: 2,
        transform: [{ scale: 1.02 }],
    },
    checkboxContainer: {
        marginRight: 16,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    guardarButton: {
        backgroundColor: "#2E7D32",
        padding: 18,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#2E7D32",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonIcon: {
        marginRight: 12,
    },
    guardarButtonDisabled: {
        backgroundColor: "#B0BEC5",
        shadowOpacity: 0.1,
    },
    guardarButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    loadingText: {
        marginTop: 12,
        color: "#546E7A",
        fontSize: 18,
        fontWeight: "500",
    },
});

export default SistemasScreen;