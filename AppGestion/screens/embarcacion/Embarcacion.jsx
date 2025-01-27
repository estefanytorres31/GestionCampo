import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const EmbarcacionesScreen = () => {
  return (
    <LinearGradient
      colors={['#ECECEC', '#ECECEC']} 
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View>
        <Text style={styles.subtitle}>Selecciona una embarcación</Text>

        <View style={styles.buttonContainer}>
          {["DON ALFREDO", "CARIBE", "ANCASH2", "CARMENCITA", "CRETA", "RODAS"].map(
            (name, index) => (
              <TouchableOpacity key={index} style={[styles.button]}>
                <Text style={styles.buttonText}>{name}</Text>
              </TouchableOpacity>
            )
          )}
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
    marginTop: 10,
    fontSize: 25,
    color: "#474444",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 45,
  },
  button: {
    marginTop: 20,
    paddingVertical: 25,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    backgroundColor: "#008987",
  },
  buttonText: {
    color: "#fff",
    fontSize: 25,
  },
});

export default EmbarcacionesScreen;
