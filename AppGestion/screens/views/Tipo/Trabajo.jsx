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

const trabajo = ({ navigation }) => {
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
                        <Text style={styles.subtitle}>Selecciona un tipo de trabajo</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {[
                            { name: 'Mantto Preventivo', style: styles.preventivo, icon: 'boat-outline' },
                            { name: 'Mantto Correctivo', style: styles.correctivo, icon: 'boat-outline' },
                            { name: 'Proyecto', style: styles.proyecto, icon: 'boat-outline' },
                            { name: 'Desmontaje / Montaje', style: styles.desmontaje, icon: 'boat-outline' },
                            
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
    preventivo: {
        backgroundColor: '#7fa23d',
    },
    correctivo: {
        backgroundColor: '#00897B',
    },
    proyecto: {
        backgroundColor: '#2E7D32',
    },
    desmontaje: {
        backgroundColor: '#C0911F',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
        flex: 1,
        marginLeft: 15,
    },
});

export default trabajo;