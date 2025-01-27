import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { height } = Dimensions.get('window')

const ClientScreen = () => {
    const { handleLogout } = useAuth();
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
    const Logout = () => {
        try{
            handleLogout();
        }catch(e){
            console.error("Error al cerrar sesión", e);
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
            <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.subtitle}>Selecciona un cliente</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.exalmar]}>
                <Ionicons name="boat" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Exalmar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.austral]}>
                <Ionicons name="boat" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Austral</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.diamante]}>
                <Ionicons name="boat" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Diamante</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.centinela]}>
                <Ionicons name="boat" size={24} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Centinela</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
                <Ionicons name="log-out-outline" size={24} color="#EB1111" style={styles.logoutIcon} />
                <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>
            </View>
            </View>
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
    },
    subtitle: {
        fontSize: 28,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
    },
    buttonContainer: {
        flex: 0.6,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: height * 0.025,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        transform: [{ scale: 1 }],
    },
    icon: {
        marginRight: 12,
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
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
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
        elevation: 4,
        shadowColor: 'rgb(26, 26, 26)',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
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