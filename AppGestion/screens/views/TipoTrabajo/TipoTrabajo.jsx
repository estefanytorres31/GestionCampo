import React, { useEffect } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import useTipoTrabajo from "../../hooks/TipoTrabajo/useTipoTabajo";

const { height } = Dimensions.get('window');

const trabajoStyles = {
    'Mantto Preventivo': {
        gradient: ['#3A416F', '#141727'],
        icon: 'wrench-clock'
    },
    'Mantto Correctivo': {
        gradient: ['#1A73E8', '#174EA6'],
        icon: 'tools'
    },
    'Proyecto': {
        gradient: ['#344767', '#1A2035'],
        icon: 'clipboard-check'
    },
    'Desmontaje / Montaje': {
        gradient: ['#1E4DB7', '#1A237E'],
        icon: 'engine'
    },
    default: {
        gradient: ['#2D3748', '#1A202C'],
        icon: 'cog'
    }
};

const Trabajo = ({ navigation }) => {
    const { tipotrabajos } = useTipoTrabajo();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleButtonPress = (screen) => {
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

        navigation.navigate(screen, { clase: 'algún valor' });
    };

    const getTrabajoStyle = (nombreTrabajo) => {
        return trabajoStyles[nombreTrabajo] || trabajoStyles.default;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Tipos de Trabajo</Text>
                    </View>

                    {tipotrabajos.length > 0 ? (
                        <View style={styles.buttonContainer}>
                            {tipotrabajos.map((trabajo, index) => {
                                const style = getTrabajoStyle(trabajo.nombre_trabajo);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.button}
                                        onPress={() => handleButtonPress(trabajo.nombre_trabajo)}
                                        activeOpacity={0.9}
                                    >
                                        <LinearGradient
                                            colors={style.gradient}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <View style={styles.iconContainer}>
                                                <MaterialCommunityIcons 
                                                    name={style.icon} 
                                                    size={24} 
                                                    color="white" 
                                                />
                                            </View>
                                            <Text style={styles.buttonText}>
                                                {trabajo.nombre_trabajo}
                                            </Text>
                                            <MaterialCommunityIcons 
                                                name="chevron-right" 
                                                size={20} 
                                                color="rgba(255,255,255,0.8)" 
                                            />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <MaterialCommunityIcons 
                                name="clipboard-text-outline" 
                                size={40} 
                                color="#94A3B8" 
                            />
                            <Text style={styles.emptyText}>
                                No hay tipos de trabajo disponibles
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerContainer: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    buttonContainer: {
        paddingTop: 8,
    },
    button: {
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    buttonText: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    }
});

export default Trabajo;