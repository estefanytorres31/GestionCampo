import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Animated,
    Dimensions,
    StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import useTipoTrabajo from "../../hooks/TipoTrabajo/useTipoTabajo";

const { width, height } = Dimensions.get('window');

const Trabajo = ({ route, navigation }) => {
    const { empresa, embarcacion } = route.params;
    const { tipotrabajos } = useTipoTrabajo();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [selectedTrabajo, setSelectedTrabajo] = useState(null);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleButtonPress = (trabajo) => {
        setSelectedTrabajo(trabajo);
        
        // Small delay to show selection before navigation
        setTimeout(() => {
            navigation.navigate("Sistemas", { empresa, embarcacion, trabajo });
        }, 100);
    };

    const renderButton = (trabajo, index) => {
        const isSelected = selectedTrabajo === trabajo;
        
        return (
            <TouchableOpacity
                key={index}
                onPress={() => handleButtonPress(trabajo)}
                activeOpacity={1}
                style={[
                    styles.buttonWrapper, 
                    { marginTop: index === 0 ? -50 : 16 }
                ]}
            >
                <LinearGradient
                    colors={isSelected 
                        ? ['#176a9e', '#02426a']  // Darker green when selected
                        : ['#75a1bc', '#507c97']  // Original gradient
                    }
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <Ionicons 
                                name="hammer" 
                                size={28} 
                                color={isSelected ? '#1f6b79' : '#628b93'} 
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{trabajo.nombre_trabajo}</Text>
                            <Text style={styles.cardSubtitle}>
                                {isSelected ? 'Seleccionado' : 'Toque para seleccionar'}
                            </Text>
                        </View>
                        <View style={styles.arrowContainer}>
                            <Ionicons 
                                name="chevron-forward" 
                                size={24} 
                                color="white" 
                            />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#0977a0', '#063d52']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Ionicons name="construct-outline" size={40} color="white" />
                    <Text style={styles.headerTitle}>Tipos de Trabajo</Text>
                    <Text style={styles.headerSubtitle}>Seleccione el tipo de trabajo a realizar</Text>
                </View>
            </LinearGradient>

            <Animated.View
                style={[
                    styles.contentContainer,
                    { opacity: fadeAnim }
                ]}
            >
                {tipotrabajos.length > 0 ? (
                    tipotrabajos.map(renderButton)
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={60} color="#9CA3AF" />
                        <Text style={styles.emptyText}>No hay tipos de trabajo disponibles</Text>
                    </View>
                )}
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    
    buttonWrapper: {
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 80,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 16,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 8,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    buttonWrapper: {
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    arrowContainer: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: height * 0.1,
    },
    emptyText: {
        fontSize: 18,
        color: '#9CA3AF',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default Trabajo;