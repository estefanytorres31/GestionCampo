import { useState, useCallback } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Animated } from "react-native"
import { ChevronDown, ChevronUp, CheckCircle, Circle, Save } from "lucide-react-native"

// Definimos los datos del checklist
const checklistData = [
  {
    id: 1,
    title: "TRANSMISIÓN SATELITAL",
    items: [
      { id: '1.1', text: 'Revisión de CPU' },
      { id: '1.2', text: 'Antena satelital' },
      { id: '1.3', text: 'Cable de antena' },
      { id: '1.4', text: 'Tablero' },
    ]
  },
  {
    id: 2,
    title: "CONTROL DE COMBUSTIBLE MP",
    items: [
      { id: '2.1', text: 'Flujómetros' },
      { id: '2.2', text: 'Sensor pick-up' },
      { id: '2.3', text: 'Switch de presión' },
      { id: '2.4', text: 'Tablero' },
      { id: '2.5', text: 'Cableado' },
    ]
  },
  {
    id: 3,
    title: "CONTROL DE COMBUSTIBLE AUXILIARES",
    items: [
      { id: '3.1', text: 'Flojómetros' },
      { id: '3.2', text: 'Tablero' },
      { id: '3.3', text: 'Cableado' },
    ]
  },
  {
    id: 4,
    title: "GESTIÓN PESCA",
    items: [
      { id: '4.1', text: 'HMI' },
      { id: '4.2', text: 'Tablero' },
      { id: '4.3', text: 'Cableado' },
    ]
  },
];

const MaintenanceChecklist = () => {
  // El resto del código se mantiene igual...
  const [expandedSections, setExpandedSections] = useState({})
  const [checkedItems, setCheckedItems] = useState({})
  const [animations] = useState(() => 
    checklistData.reduce((acc, section) => ({
      ...acc,
      [section.id]: new Animated.Value(0)
    }), {})
  )

  const toggleSection = useCallback((sectionId) => {
    const toValue = expandedSections[sectionId] ? 0 : 1
    Animated.spring(animations[sectionId], {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8
    }).start()

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }, [expandedSections, animations])

  const toggleItem = useCallback((itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }, [])

  const getProgress = useCallback((items) => {
    const checkedCount = items.filter((item) => checkedItems[item.id]).length
    return { count: checkedCount, total: items.length }
  }, [checkedItems])

  const saveData = useCallback(() => {
    Alert.alert(
      "¡Éxito!",
      "Datos guardados correctamente",
      [{ text: "OK", style: "default" }]
    )
  }, [])

  const renderProgressBar = useCallback((items) => {
    const { count, total } = getProgress(items)
    const percentage = (count / total) * 100

    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        <Text style={styles.progressText}>{`${count}/${total}`}</Text>
      </View>
    )
  }, [getProgress])

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Checklist de Mantto Preventivo</Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {checklistData.map((section) => (
            <Animated.View 
              key={section.id} 
              style={[
                styles.section,
                {
                  transform: [{
                    scale: animations[section.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02]
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.sectionHeader} 
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeaderContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {expandedSections[section.id] ? (
                    <ChevronUp size={24} color="#6366f1" />
                  ) : (
                    <ChevronDown size={24} color="#6366f1" />
                  )}
                </View>
                {renderProgressBar(section.items)}
              </TouchableOpacity>

              {expandedSections[section.id] && (
                <View style={styles.itemsContainer}>
                  {section.items.map((item) => (
                    <TouchableOpacity 
                      key={item.id} 
                      style={styles.item} 
                      onPress={() => toggleItem(item.id)}
                      activeOpacity={0.7}
                    >
                      {checkedItems[item.id] ? (
                        <CheckCircle size={24} color="#6366f1" />
                      ) : (
                        <Circle size={24} color="#d1d5db" />
                      )}
                      <Text style={[
                        styles.itemText,
                        checkedItems[item.id] && styles.checkedItemText
                      ]}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveData}
          activeOpacity={0.8}
        >
          <Save size={24} color="#ffffff" />
          <Text style={styles.saveButtonText}>Guardar Datos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

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
})

export default MaintenanceChecklist