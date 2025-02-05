import React, { useState, useCallback, useEffect } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Circle, Save } from "lucide-react-native";
import { View, Text, ScrollView, TextInput, SafeAreaView, ActivityIndicator, StyleSheet, TouchableOpacity, Animated, Alert } from "react-native";
import useOrdenTrabajoSistema from "../../hooks/OrdenTrabajoSistema/useOrdenTrabajoSistema";
import useOrdenTrabajoParte from "../../hooks/OrdenTrabajoParte/useOrdenTrabajoParte";

const CollapsibleSistema = ({ sistema, selectedParts, onTogglePart, comments, onCommentChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8
    }).start();
    setIsExpanded(!isExpanded);
  }, [isExpanded, animation]);

  const getProgress = useCallback(() => {
    if (!sistema.partes || sistema.partes.length === 0) return { count: 0, total: 0 };
    const checkedCount = sistema.partes.filter(parte => 
      selectedParts[parte.id_orden_trabajo_parte] || parte.estado_parte === "completado"
    ).length;
    return { count: checkedCount, total: sistema.partes.length };
  }, [sistema.partes, selectedParts]);

  const renderProgressBar = () => {
    const { count, total } = getProgress();
    if (total === 0) return null;
    const percentage = (count / total) * 100;
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        <Text style={styles.progressText}>{`${count}/${total}`}</Text>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.section, {
      transform: [{
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.02]
        })
      }]
    }]}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionTitle}>{sistema.sistema.nombre_sistema}</Text>
          {isExpanded ? <ChevronUp size={24} color="#6366f1" /> : <ChevronDown size={24} color="#6366f1" />}
        </View>
        {renderProgressBar()}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.itemsContainer}>
          {sistema.partes && sistema.partes.length > 0 ? (
            sistema.partes.map((parte) => (
              <View key={parte.id_orden_trabajo_parte} style={styles.partContainer}>
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => parte.estado_parte !== "completado" && onTogglePart(parte.id_orden_trabajo_parte)}
                  activeOpacity={parte.estado_parte === "completado" ? 1 : 0.7}
                >
                  {parte.estado_parte === "completado" ? (
                    <CheckCircle size={24} color="#9CA3AF" />
                  ) : selectedParts[parte.id_orden_trabajo_parte] ? (
                    <CheckCircle size={24} color="#6366f1" />
                  ) : (
                    <Circle size={24} color="#d1d5db" />
                  )}
                  <Text style={[
                    styles.itemText,
                    parte.estado_parte === "completado" && styles.completedItemText,
                    selectedParts[parte.id_orden_trabajo_parte] && styles.checkedItemText
                  ]}>
                    {parte.parte.nombre_parte}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.commentInput,
                    parte.estado_parte === "completado" && styles.disabledCommentInput
                  ]}
                  placeholder="Agregar comentario..."
                  value={comments[parte.id_orden_trabajo_parte] || ""}
                  onChangeText={(text) => onCommentChange(parte.id_orden_trabajo_parte, text)}
                  editable={parte.estado_parte !== "completado"}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No hay partes disponibles</Text>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const SistemasPartes = ({ route, navigation }) => {
  const { idOrden } = route.params;
  const { obtenerOrdenTrabajoSistemaByOrdenTrabajo } = useOrdenTrabajoSistema();
  const { actualizarOrdenTrabajoParte } = useOrdenTrabajoParte();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParts, setSelectedParts] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    let isMounted = true;
  
    const fetchSistemasPartes = async () => {
      try {
        const response = await obtenerOrdenTrabajoSistemaByOrdenTrabajo(idOrden);
        if (!response || !Array.isArray(response)) {
          throw new Error("Formato de respuesta inválido");
        }
        
        if (isMounted) {
          setData(response);
          // Initialize selectedParts and comments based on the fetched data
          const initialSelectedParts = {};
          const initialComments = {};
          response.forEach(sistema => {
            sistema.partes.forEach(parte => {
              if (parte.estado_parte === "completado") {
                initialSelectedParts[parte.id_orden_trabajo_parte] = true;
                initialComments[parte.id_orden_trabajo_parte] = parte.comentario_parte || "";
              }
            });
          });
          setSelectedParts(initialSelectedParts);
          setComments(initialComments);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || "Error desconocido al cargar los datos.");
          console.error('Error details:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchSistemasPartes();
    return () => { isMounted = false; };
  }, [idOrden]);

  const togglePart = useCallback((id_orden_trabajo_parte) => {
    setSelectedParts(prev => ({
      ...prev,
      [id_orden_trabajo_parte]: !prev[id_orden_trabajo_parte]
    }));
  }, []);

  const handleCommentChange = useCallback((id_orden_trabajo_parte, text) => {
    setComments(prev => ({
      ...prev,
      [id_orden_trabajo_parte]: text
    }));
  }, []);

  const saveSelectedParts = useCallback(async () => {
    const selectedPartsList = Object.entries(selectedParts)
      .filter(([_, isSelected]) => isSelected)
      .map(([id_orden_trabajo_parte]) => parseInt(id_orden_trabajo_parte));

    if (selectedPartsList.length === 0) {
      Alert.alert("Advertencia", "Por favor seleccione al menos una parte para continuar.");
      return;
    }

    try {
      await Promise.all(selectedPartsList.map(id_orden_trabajo_parte => 
        actualizarOrdenTrabajoParte(
          id_orden_trabajo_parte, 
          "completado", 
          comments[id_orden_trabajo_parte] || ""
        )
      ));

      Alert.alert(
        "Éxito",
        "Partes seleccionadas guardadas correctamente",
        [{ 
          text: "OK",
          onPress: () => {
            navigation.navigate('FormPreventivo', { selectedParts: selectedPartsList });
          }
        }]
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar las partes seleccionadas.");
      console.error('Error saving parts:', error);
    }
  }, [selectedParts, comments, actualizarOrdenTrabajoParte, navigation]);

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
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>No hay sistemas o partes disponibles.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Sistemas y Partes</Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {data.map((item) => (
            <CollapsibleSistema 
              key={item.id_orden_trabajo_sistema}
              sistema={item}
              selectedParts={selectedParts}
              onTogglePart={togglePart}
              comments={comments}
              onCommentChange={handleCommentChange}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveSelectedParts}
          activeOpacity={0.8}
        >
          <Save size={24} color="#ffffff" />
          <Text style={styles.saveButtonText}>Guardar Selección</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginVertical: 20,
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    padding: 16,
  },
  sectionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },
  progressText: {
    position: "absolute",
    right: 0,
    top: -20,
    fontSize: 12,
    color: "#64748b",
  },
  itemsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#334155",
    flex: 1,
    lineHeight: 24,
  },
  checkedItemText: {
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f8fafc",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  partContainer: {
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
    backgroundColor: "#f8fafc",
  },
});

export default SistemasPartes;