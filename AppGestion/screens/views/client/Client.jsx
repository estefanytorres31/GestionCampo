import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


const ClientScreen = () =>{
    
    return(
        <LinearGradient
              colors={['#E9E9E9']} 
              style={styles.container}
              start={{x: 0.5, y: 0}} 
              end={{x: 0.5, y: 0}}
            >
        <View>
            <Text style={styles.subtitle}>Selecciona un Cliente</Text>


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.exalmar]}>
                    <Text style={styles.buttonText}>Exalmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.austral]}>
                    <Text style={styles.buttonText}>Austral</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.diamante]}>
                    <Text style={styles.buttonText}>Diamante</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.centinela]}>
                    <Text style={styles.buttonText}>Centinela</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>
            </View>
        </View>
        </LinearGradient>

    );
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
      },
    subtitle: {
        marginTop: 25,
        fontSize: 25,
        color: "#474444",
        textAlign: "center",
        
    },
    buttonContainer: {
        marginTop: 45,
    },
    button: {
        marginTop: 25,
        paddingHorizontal: 130,
        paddingVertical: 25,
        borderRadius: 8,
        marginVertical: 5,
        alignItems: "center",
       
    },
    exalmar: {
        backgroundColor: "#008987",
    },
    austral: {
        backgroundColor: "#008932",
    },
    diamante: {
        backgroundColor: "#AF8710",
    },
    centinela: {
        backgroundColor: "#004089",
    },
    buttonText: {
        color: "#fff",
        fontSize: 25,
      
    },
    logoutButton: {
        marginTop: 55,
        paddingVertical: 12,
        marginLeft:89,
        borderRadius: 20,
        alignItems: "center",
        width:180,
        backgroundColor: "#d3d3d3",
    },
    logoutText: {
        color: "#EB1111DE",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },

});
export default ClientScreen;