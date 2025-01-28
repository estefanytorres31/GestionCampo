import React, { useEffect } from "react"
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    Dimensions,
    BackHandler,
    Animated 
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from '@react-navigation/native'
import useAuth from '../../hooks/Auth/useAuth'
import AsyncStorage from "@react-native-async-storage/async-storage"

const { height, width } = Dimensions.get('window')

const ClientScreen = ({ navigation }) => {
    const auth = useAuth();
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

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const Logout = async () => {
        try {
            if (auth && auth.handleLogout) {
                await auth.handleLogout();
            }
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            console.error("Error al cerrar sesión:", e);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#def8f6", "#e0e0e0"]}
                style={styles.container}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
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
                        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
                        <Text style={styles.subtitle}>Selecciona un cliente</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {[
                            { name: 'Exalmar', style: styles.exalmar, icon: 'boat-outline' },
                            { name: 'Austral', style: styles.austral, icon: 'boat-outline' },
                            { name: 'Diamante', style: styles.diamante, icon: 'boat-outline' },
                            { name: 'Centinela', style: styles.centinela, icon: 'boat-outline' }
                        ].map((client, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.button, client.style]}
                                onPress={() => handleButtonPress(client.name)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.buttonContent}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={client.icon} size={28} color="white" />
                                    </View>
                                    <Text style={styles.buttonText}>{client.name}</Text>
                                    <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.footerContainer}>
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={Logout}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#EB1111" style={styles.logoutIcon} />
                            <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    headerContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2d3436',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#636e72',
        textAlign: 'center',
    },
    buttonContainer: {
        flex: 0.6,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    button: {
        marginVertical: 10,
        borderRadius: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: height * 0.022,
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exalmar: {
        backgroundColor: '#00897B',
    },
    austral: {
        backgroundColor: '#2E7D32',
    },
    diamante: {
        backgroundColor: '#C0911F',
    },
    centinela: {
        backgroundColor: '#1565C0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
        flex: 1,
        marginLeft: 15,
    },
    footerContainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 30,
        width: '80%',
        maxWidth: 280,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        color: '#EB1111',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
})

export default ClientScreen