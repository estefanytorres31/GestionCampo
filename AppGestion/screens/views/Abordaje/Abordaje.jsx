import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image } from "react-native";
import useAbordaje from "../../hooks/Abordaje/useAbordaje";

const Abordaje = ({ route }) => {
  const { idAbordaje } = route.params;
  const { obtenerAbordajePorId } = useAbordaje();
  const [abordaje, setAbordaje] = useState(null);

  useEffect(() => {
    const fetchAbordaje = async () => {
      try {
        console.log("Obteniendo abordaje con ID:", idAbordaje);
        const response = await obtenerAbordajePorId(idAbordaje);

        if (!response || !response.data) {
          throw new Error("El abordaje no fue encontrado");
        }

        setAbordaje(response.data);
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

  // Extraer datos correctamente de la estructura de `abordaje`
  const { 
    id, 
    fecha, 
    motorista, 
    supervisor, 
    id_puerto, 
    ordenTrabajoUsuario 
  } = abordaje;

  const { 
    orden_trabajo 
  } = ordenTrabajoUsuario || {};

  const { 
    codigo, 
    estado, 
    orden_trabajo_sistemas = [] 
  } = orden_trabajo || {};

  const detalles = orden_trabajo_sistemas.map(sistema => sistema.detalle).filter(Boolean);
  const fotos = orden_trabajo_sistemas.flatMap(sistema => sistema.fotos || []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.title}>Detalles del Abordaje</Text>
          <Text style={styles.label}>Código OT: <Text style={styles.value}>{codigo}</Text></Text>
          <Text style={styles.label}>Puerto ID: <Text style={styles.value}>{id_puerto}</Text></Text>
          <Text style={styles.label}>Técnico: <Text style={styles.value}>{ordenTrabajoUsuario?.rol_en_orden || "No disponible"}</Text></Text>
          <Text style={styles.label}>Supervisor: <Text style={styles.value}>{supervisor}</Text></Text>
          <Text style={styles.label}>Motorista: <Text style={styles.value}>{motorista}</Text></Text>
          <Text style={styles.label}>Fecha: <Text style={styles.value}>{new Date(fecha).toLocaleString()}</Text></Text>
          <Text style={styles.label}>Estado: <Text style={styles.value}>{estado}</Text></Text>
        </View>

        {detalles.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.subTitle}>Detalles del Sistema</Text>
            {detalles.map((detalle, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.label}>Observaciones: <Text style={styles.value}>{detalle.observaciones}</Text></Text>
                <Text style={styles.label}>Avance: <Text style={styles.value}>{detalle.avance}%</Text></Text>
                <Text style={styles.label}>Materiales: <Text style={styles.value}>{detalle.materiales}</Text></Text>
                <Text style={styles.label}>Próximo abordaje: <Text style={styles.value}>{detalle.proximo_abordaje}</Text></Text>
              </View>
            ))}
          </View>
        )}

        {fotos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.subTitle}>Fotos del Abordaje</Text>
            {fotos.map((foto, index) => (
              <Image key={index} source={{ uri: foto.url }} style={styles.image} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollView: { padding: 16 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 3, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "400", color: "#555" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#666" },
  detailItem: { marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  image: { width: "100%", height: 200, marginTop: 10, borderRadius: 8 }
});

export default Abordaje;