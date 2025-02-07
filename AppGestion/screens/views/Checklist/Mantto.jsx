import React, { useState, useCallback, useEffect } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Circle, Save } from "lucide-react-native";
import { View, Text, ScrollView, TextInput, SafeAreaView, ActivityIndicator, StyleSheet, TouchableOpacity, Animated, Alert } from "react-native";
import useOrdenTrabajoSistema from "../../hooks/OrdenTrabajoSistema/useOrdenTrabajoSistema";
import useOrdenTrabajoParte from "../../hooks/OrdenTrabajoParte/useOrdenTrabajoParte";
import useOrdenTrabajo from "../../hooks/OrdenTrabajo/useOrdenTrabajo";

const CollapsibleSistema = ({ sistema, selectedParts, onTogglePart, comments, onCommentChange, onSaveSystem }) => {
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

  const handleSaveSystem = () => {
    const selectedPartsForSystem = sistema.partes
      .filter(parte => selectedParts[parte.id_orden_trabajo_parte] && parte.estado_parte !== "completado")
      .map(parte => ({
        id: parte.id_orden_trabajo_parte,
        comment: comments[parte.id_orden_trabajo_parte] || ""
      }));

    if (selectedPartsForSystem.length === 0) {
      Alert.alert("Advertencia", "Por favor seleccione al menos una parte nueva para este sistema.");
      return;
    }

    onSaveSystem(sistema.id_orden_trabajo_sistema, selectedPartsForSystem);
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
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveSystem}
            activeOpacity={0.8}
          >
            <Save size={24} color="#ffffff" />
            <Text style={styles.saveButtonText}>Guardar Sistema</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const SistemasPartes = ({ route, navigation }) => {
  const { idOrden } = route.params;
  const { obtenerOrdenTrabajoSistemaByOrdenTrabajo, actualizarOrdenTrabajoSistema } = useOrdenTrabajoSistema();
  const { actualizarOrdenTrabajoParte } = useOrdenTrabajoParte();
  const {actualizarOrdenTrabajo}=useOrdenTrabajo();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParts, setSelectedParts] = useState({});
  const [comments, setComments] = useState({});

  const fetchSistemasPartes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await obtenerOrdenTrabajoSistemaByOrdenTrabajo(idOrden)
      if (!response || !Array.isArray(response)) {
        throw new Error("Formato de respuesta inválido")
      }

      setData(response)
      const initialSelectedParts = {}
      const initialComments = {}
      response.forEach((sistema) => {
        sistema.partes.forEach((parte) => {
          initialSelectedParts[parte.id_orden_trabajo_parte] = parte.estado_parte === "completado"
          initialComments[parte.id_orden_trabajo_parte] = parte.comentario_parte || ""
        })
      })
      setSelectedParts(initialSelectedParts)
      setComments(initialComments)
    } catch (error) {
      setError(error.message || "Error desconocido al cargar los datos.")
      console.error("Error details:", error)
    } finally {
      setLoading(false)
    }
  }, [idOrden])

  useEffect(() => {
    fetchSistemasPartes()
  }, [fetchSistemasPartes])

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
    const newlySelectedParts = Object.entries(selectedParts)
      .filter(([id, isSelected]) => {
        const parte = data.flatMap(s => s.partes).find(p => p.id_orden_trabajo_parte.toString() === id);
        return isSelected && parte && parte.estado_parte !== "completado";
      })
      .map(([id]) => parseInt(id));
  
    if (newlySelectedParts.length === 0) {
      Alert.alert("Advertencia", "Por favor seleccione al menos una parte nueva para continuar.");
      return;
    }
  
    try {
      // Update all newly selected parts
      await Promise.all(newlySelectedParts.map(id_orden_trabajo_parte => 
        actualizarOrdenTrabajoParte(
          id_orden_trabajo_parte, 
          "completado", 
          comments[id_orden_trabajo_parte] || null
        )
      ));
  
      // Check each system's completion status
      const sistemasEstados = data.map((sistema) => {
        const sistemaPartes = sistema.partes.map((parte) => ({
          ...parte,
          isSelected: selectedParts[parte.id_orden_trabajo_parte] || parte.estado_parte === "completado",
        }))

        return {
          id_orden_trabajo_sistema: sistema.id_orden_trabajo_sistema,
          allCompleted: sistemaPartes.every((parte) => parte.isSelected),
        }
      })
  
      // Update systems status
      await Promise.all(
        sistemasEstados.map(({ id_orden_trabajo_sistema, allCompleted }) => 
          actualizarOrdenTrabajoSistema(
            id_orden_trabajo_sistema, 
            allCompleted ? "completado" : "en_progreso"
          )
        )
      );
  
      // Check if all systems are completed
      const allSystemsCompleted = sistemasEstados.every((sistema) => sistema.allCompleted)

      // Update work order status
      const newOrdenTrabajoStatus = allSystemsCompleted ? "completado" : "en_progreso"
      await actualizarOrdenTrabajo(idOrden, newOrdenTrabajoStatus)

      // Refresh the data after saving
      await fetchSistemasPartes()
      Alert.alert(
        "Éxito",
        `Partes guardadas correctamente${allSystemsCompleted ? ' y orden de trabajo completada' : ''}`,
        [{ 
          text: "OK",
          onPress: () => {
            navigation.navigate('FormPreventivo', { selectedParts: newlySelectedParts });
          }
        }]
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar las partes seleccionadas.");
      console.error('Error saving parts:', error);
    }
  }, [selectedParts, comments, data, actualizarOrdenTrabajoParte, actualizarOrdenTrabajoSistema, actualizarOrdenTrabajo, navigation]);

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
              onSaveSystem={saveSelectedParts}
            />
          ))}
        </View>
      </ScrollView>
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