import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, BackHandler, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation,CommonActions } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import useAuth from '../../hooks/Auth/useAuth';

const { width } = Dimensions.get('window');

const Inicio = ({ navigation }) => {
    const { logout } = useAuth();
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    const handleLogout = () => {
        logout();
        navigation.navigate('Login');
    };

    return (
    <SafeAreaView style={styles.safeArea}>
        <LinearGradient
            colors={["#def8f6", "#e0e0e0"]}
            style={styles.container}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
                        <Text style={styles.headerTitle}>Panel Principal</Text>
                        <Text style={styles.headerSubtitle}>
                            Selecciona una opción para comenzar
                        </Text>
                    </View>
                    
                    <View style={styles.cardContainer}>
                        <TouchableOpacity 
                            style={[styles.card, styles.qrCard]}
                            onPress={() => navigation.navigate('QRScann')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="camera" size={28} color="#fff" />
                                </View>
                                <View style={styles.cardTextContainer}>
                                    <Text style={styles.cardTitle}>Escanear QR</Text>
                                    <MaterialCommunityIcons 
                                        name="chevron-right" 
                                        size={24} 
                                        color="#fff" 
                                        style={styles.chevron}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerContainer}>
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={handleLogout}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#EB1111" style={styles.logoutIcon} />
                            <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 20,
        color: '#ffb305',
        opacity: 0.9,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'black',
        opacity: 0.8,
        textAlign: 'center',
    },
    cardContainer: {
        marginTop: 30,
        gap: 20,
    },
    card: {
        borderRadius: 16,
        marginBottom: 15,
        height: 80,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        height: '100%',
    },
    qrCard: {
        backgroundColor: '#2196f3',
    },
    cashCard: {
        backgroundColor: '#4caf50',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        //backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    chevron: {
        opacity: 0.8,
    },
    footerContainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#EB1111",
    },
});

export default Inicio;