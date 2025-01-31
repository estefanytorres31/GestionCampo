import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import useOrdenTrabajo from "../../hooks/OrdenTrabajo/useOrdenTrabajo";
import useTipoTrabajoESP from "../../hooks/TipoTrabajoESP/useTipoTrabajoESP";

const SistemasPartes = ({ route }) => {
  const { idOrden } = route.params;
  const { tipoTrabajosESP, fetchTiposTrabajosWithPartsESP } = useTipoTrabajoESP();
  const { obtenerOrdenTrabajo } = useOrdenTrabajo();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSistemasPartes = async () => {
      try {
        console.log('Iniciando fetchSistemasPartes con idOrden:', idOrden);
        
        // Obtener los datos de la orden de trabajo
        const responseOrden = await obtenerOrdenTrabajo(idOrden);
        console.log('Response Orden:', responseOrden);
        
        if (!responseOrden) {
          throw new Error("No se pudo obtener la orden de trabajo.");
        }

        const { id_tipo_trabajo, id_embarcacion } = responseOrden;
        console.log('id_tipo_trabajo:', id_tipo_trabajo, 'id_embarcacion:', id_embarcacion);
        
        if (!id_tipo_trabajo || !id_embarcacion) {
          throw new Error("Datos de orden de trabajo incompletos.");
        }

        // Obtener los sistemas y partes
        console.log('Llamando a fetchTiposTrabajosWithPartsESP...');
        const responseSistemas = await fetchTiposTrabajosWithPartsESP(
          id_tipo_trabajo, 
          id_embarcacion
        );
        console.log('Response Sistemas completo:', JSON.stringify(responseSistemas));

        if (!responseSistemas) {
          throw new Error("La respuesta de sistemas es undefined");
        }

        if (!responseSistemas.data) {
          throw new Error("La respuesta no contiene el campo data");
        }

        if (!responseSistemas.data.data) {
          throw new Error("El formato de la respuesta no es el esperado");
        }

        if (isMounted) {
          setData(responseSistemas.data.data);
          console.log('Datos establecidos correctamente:', responseSistemas.data.data);
        }
      } catch (error) {
        console.error('Error detallado:', error);
        if (isMounted) {
          setError(error.message || "Error desconocido al cargar los datos.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSistemasPartes();

    return () => {
      isMounted = false;
    };
  }, [idOrden]);

  useEffect(() => {
    console.log('Estado actual:', { loading, error, dataExists: !!data });
  }, [loading, error, data]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.debugText}>ID Orden: {idOrden}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>No hay sistemas o partes disponibles.</Text>
        <Text style={styles.debugText}>ID Orden: {idOrden}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.debugText}>ID Orden: {idOrden}</Text>
      {data.map((sistema) => (
        <View key={sistema.id_sistema} style={styles.sistemaContainer}>
          <Text style={styles.sistemaTitle}>{sistema.nombre_sistema}</Text>
          {sistema.partes?.length > 0 ? (
            sistema.partes.map((parte) => (
              <Text key={parte.id_parte} style={styles.parteText}>
                - {parte.nombre_parte}
              </Text>
            ))
          ) : (
            <Text style={styles.messageText}>No hay partes disponibles</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (estilos anteriores) ...
  debugText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
});

export default SistemasPartes;