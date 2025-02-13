import React, { useEffect, useRef } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    Dimensions,
    Animated,
    ScrollView
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import useEmpresa from "../../hooks/Empresa/useEmpresa";
import useAuth from '../../hooks/Auth/useAuth';

const { height, width } = Dimensions.get('window');

const empresasOrden = ['Tasa', 'Exalmar', 'Austral', 'Diamante', 'Centinela'];
const coloresBotones = [
    ['#4f46e5', '#7c3aed'], // Indigo to Purple
    ['#2563eb', '#3b82f6'], // Blue shades
    ['#0d9488', '#14b8a6'], // Teal shades
    ['#0891b2', '#06b6d4'], // Cyan shades
    ['#7c2d12', '#9a3412']  // Orange shades
];

const ActionButton = ({ icon, title, count, onPress, gradientColors }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionButton}
                >
                    <View style={styles.actionButtonInner}>
                        <View style={styles.iconBadgeContainer}>
                            <MaterialCommunityIcons name={icon} size={28} color="white" />
                            {count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.actionButtonText}>{title}</Text>
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const NotificationButton = ({ count, onPress }) => (
    <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={onPress}
        activeOpacity={0.8}
    >
        <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.notificationGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.notificationContent}>
                <View style={styles.notificationTopRow}>
                    <Text style={styles.notificationLabel}>Avisos</Text>
                    <MaterialCommunityIcons name="bell-ring-outline" size={22} color="white" />
                </View>
                <Text style={styles.notificationCount}>{count}</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const CompanyButton = ({ empresa, gradientColors, onPress, onNotificationPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.companyButtonRow}>
            <TouchableOpacity 
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                activeOpacity={0.9}
                style={styles.buttonWrapper}
            >
                <Animated.View style={[styles.buttonAnimatedContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.companyButton}
                    >
                        <BlurView intensity={20} style={styles.blurOverlay}>
                            <View style={styles.buttonContent}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="boat-outline" size={20} color="white" />
                                </View>
                                <Text style={styles.buttonText}>{empresa.nombre}</Text>
                                {/* <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.9)" /> */}
                            </View>
                        </BlurView>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
            <NotificationButton count={12} onPress={onNotificationPress} />
        </View>
    );
};

const ClientScreen = ({ navigation }) => {
    const { empresas } = useEmpresa();
    const { user, logout } = useAuth(); // Add logout from useAuth
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const empresasOrdenadas = [...empresas].sort((a, b) => {
        return empresasOrden.indexOf(a.nombre) - empresasOrden.indexOf(b.nombre);
    });

    const handleLogout = async () => {
        try {
            await logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#1e1b4b", "#312e81", "#4338ca"]}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <MaskedView
                    style={styles.backgroundPattern}
                    maskElement={
                        <View style={styles.patternContainer}>
                            {/* Add your pattern elements here */}
                        </View>
                    }
                >
                    <LinearGradient
                        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                        style={StyleSheet.absoluteFill}
                    />
                </MaskedView>

                <Animated.View 
                    style={[
                        styles.contentContainer, 
                        { 
                            opacity: fadeAnim, 
                            transform: [{ scale: scaleAnim }] 
                        }
                    ]}
                >
                    <View style={styles.welcomeContainer}>
                        <View style={styles.welcomeRow}>
                            <Text style={styles.welcomeText}>¡Bienvenido, </Text>
                            <Text style={styles.userName}>{user?.nombre_usuario || ''}!</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.actionButtonsRow}
                        >
                            <ActionButton 
                                icon="file-plus-outline" 
                                title="Crear OT" 
                                count={0}
                                gradientColors={['#4f46e5', '#7c3aed']}
                                onPress={() => navigation.navigate('Clientes')}
                            />                            
                            <ActionButton 
                                icon="clipboard-list-outline" 
                                title="Lista OT" 
                                count={12}
                                gradientColors={['#0d9488', '#14b8a6']}
                                onPress={() => navigation.navigate('ListaOTAsignado')}
                            />
                            <ActionButton 
                                icon="qrcode-scan" 
                                title="QR" 
                                count={0}
                                gradientColors={['#2563eb', '#3b82f6']}
                                onPress={() => navigation.navigate('QRScann')}
                            />

                            <ActionButton 
                                icon="clipboard-account-outline" 
                                title="Historial" 
                                count={5}
                                gradientColors={['#0891b2', '#06b6d4']}
                                onPress={() => navigation.navigate('MisOT')}
                            />
                        </ScrollView>
                    </View>

                    <View style={styles.companiesSection}>
                        <ScrollView 
                            style={styles.companiesContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.companiesScrollContent}
                        >
                            {empresasOrdenadas.map((empresa, index) => (
                                <CompanyButton
                                    key={empresa.id || index}
                                    empresa={empresa}
                                    gradientColors={coloresBotones[index % coloresBotones.length]}
                                    onPress={() => {}}
                                    onNotificationPress={() => {}}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#dc2626', '#991b1b']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.logoutGradient}
                        >
                            <View style={styles.logoutContent}>
                                <Ionicons name="log-out-outline" size={24} color="white" />
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    backgroundPattern: {
        ...StyleSheet.absoluteFillObject,
    },
    patternContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    welcomeContainer: {
        marginTop: 40,
        marginBottom: 24,
        alignItems: 'center',
    },
    welcomeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 25,
        color: '#eed028',
        fontWeight: '600',
        
    },
    userName: {
        fontSize: 25,
        color: '#eed028',
        fontWeight: 'bold',
        fontWeight: '600',
    },
    actionButtonsContainer: {
        marginBottom: 24,
    },
    actionButtonsRow: {
        paddingVertical: 8,
        gap: 12,
        paddingHorizontal: 4,
    },
    actionButton: {
        borderRadius: 20,
        padding: 16,
        minWidth: width * 0.25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    actionButtonInner: {
        alignItems: 'center',
        gap: 12,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    iconBadgeContainer: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    badgeText: {
        color: '#1a1a1a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    companiesSection: {
        flex: 1,
        justifyContent: 'center',
    },
    companiesContainer: {
        flex: 1,
    },
    companyButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    buttonWrapper: {
        flex: 1,
    },
    buttonAnimatedContainer: {
        borderRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    companyButton: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    blurOverlay: {
        overflow: 'hidden',
        borderRadius: 24,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    iconContainer: { // EMBARCACIÓN
        width: 40,
        height: 40,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: { // EMBARCACIÓN
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    notificationButton: {
        width: 180,
        height: 80,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    notificationGradient: {
        flex: 1,
        padding: 12,
    },
    notificationContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    notificationTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    notificationLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    },
    notificationCount: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        position: 'absolute',
        left: -2,
        top: 30
    },
    companiesScrollContent: {
        paddingBottom: 80, // Add padding to accommodate the logout button
    },
    notificationLabel: { // Avisos
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    },
    notificationContent: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoutGradient: {
        borderRadius: 20,
    },
    logoutContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 12,
    },
    logoutText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ClientScreen;