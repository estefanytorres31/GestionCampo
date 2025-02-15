import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import useAbordaje from '../../hooks/Abordaje/useAbordaje';

const Abordaje = ({ route }) => {
  const { idAbordaje } = route.params;
  const { obtenerAbordajePorId } = useAbordaje();  // Hook para obtener un abordaje específico
  const [abordaje, setAbordaje] = useState(null);

  useEffect(() => {
    const fetchAbordaje = async () => {
      try {
        console.log("Obteniendo abordaje con ID:", idAbordaje);
        const data = await obtenerAbordajePorId(idAbordaje);
        if (!data) {
          throw new Error("El abordaje no fue encontrado");
        }
        setAbordaje(data);
      } catch (error) {
        console.error("Error al obtener los detalles del abordaje:", error.response?.data || error.message);
      }
    };
  
    if (idAbordaje) {
      fetchAbordaje();
    } else {
      console.error("Error: idAbordaje no está definido.");
    }
  }, [idAbordaje]);
  

  if (!abordaje) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando detalles del abordaje...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.title}>Detalles del Abordaje</Text>
          <Text style={styles.label}>Código OT: <Text style={styles.value}>{abordaje.codigoOT}</Text></Text>
          <Text style={styles.label}>Puerto: <Text style={styles.value}>{abordaje.puerto}</Text></Text>
          <Text style={styles.label}>Técnico: <Text style={styles.value}>{abordaje.tecnico}</Text></Text>
          <Text style={styles.label}>Supervisor: <Text style={styles.value}>{abordaje.supervisor}</Text></Text>
          <Text style={styles.label}>Motorista: <Text style={styles.value}>{abordaje.motorista}</Text></Text>
          <Text style={styles.label}>Fecha: <Text style={styles.value}>{abordaje.fecha}</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollView: { padding: 16 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 3 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "400", color: "#555" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#666" }
});

export default Abordaje;
