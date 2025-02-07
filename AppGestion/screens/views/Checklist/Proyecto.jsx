import { useState, useCallback } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Animated } from "react-native"
import { ChevronDown, ChevronUp, CheckCircle, Circle, Save } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const checklistData = [
  {
    id: 1,
    title: "Transmisión Satelital",
    items: [
      { id: "1.1", text: "Coordinaciones" },
      { id: "1.2", text: "Soldadura" },
      { id: "1.3", text: "Cableado" },
      { id: "1.4", text: "Instalación de equipos" },
      { id: "1.5", text: "Programación y configuración" },
      { id: "1.6", text: "Prueba de funcionamiento" }
    ],
    hasNote: true
  },
  {
    id: 2,
    title: "Control de Combustible MP",
    sections: [
      {
        subtitle: "TALLER",
        items: [
          { id: "3.1", text: "Armado de tablero" }
        ],
        hasNote: true
      },
      {
        subtitle: "CAMPO",
        items: [
          { id: "3.2", text: "Coordinaciones" },
          { id: "3.3", text: "Soldadura" },
          { id: "3.4", text: "Cableado" },
          { id: "3.5", text: "Instalación de equipos y componentes" },
          { id: "3.6", text: "Programación y configuración" },
          { id: "3.7", text: "Prueba de funcionamiento" }
        ],
        hasNote: true
      }
    ]
  },
  {
    id: 3,
    title: "Control de Combustible Auxiliares",
    sections: [
      {
        subtitle: "TALLER",
        items: [
          { id: "3.1", text: "Armado de tablero" }
        ],
        hasNote: true
      },
      {
        subtitle: "CAMPO",
        items: [
          { id: "3.2", text: "Coordinaciones" },
          { id: "3.3", text: "Soldadura" },
          { id: "3.4", text: "Cableado" },
          { id: "3.5", text: "Instalación de equipos y componentes" },
          { id: "3.6", text: "Programación y configuración" },
          { id: "3.7", text: "Prueba de funcionamiento" }
        ],
        hasNote: true
      }
    ]
  },
  {
    id: 4,
    title: "Gestión Pesca – PC",
    sections: [
      {
        subtitle: "TALLER",
        items: [
          { id: "4.1", text: "Ensamble de equipos" },
          { id: "4.2", text: "Programación de CPU" }
        ],
        hasNote: true
      },
      {
        subtitle: "CAMPO",
        items: [
          { id: "4.3", text: "Coordinaciones" },
          { id: "4.4", text: "Cableado" },
          { id: "4.5", text: "Instalación de equipos" },
          { id: "4.6", text: "Programación y configuración" },
          { id: "4.7", text: "Prueba de funcionamiento" }
        ],
        hasNote: true
      }
    ]
  },
  {
    id: 5,
    title: "Nivel de Tanques",
    sections: [
      {
        subtitle: "TALLER",
        items: [
          { id: "5.1", text: "Fabricación y ensamble de vasos comunicantes/sensores" },
          { id: "5.2", text: "Armado de tablero" }
        ],
        hasNote: true
      },
      {
        subtitle: "CAMPO",
        items: [
          { id: "5.3", text: "Coordinaciones" },
          { id: "5.4", text: "Soldadura" },
          { id: "5.5", text: "Cableado" },
          { id: "5.6", text: "Instalación de equipos" },
          { id: "5.7", text: "Calibración de sensores" },
          { id: "5.8", text: "Programación y configuración" },
          { id: "5.9", text: "Prueba de funcionamiento" }
        ],
        hasNote: true
      }
    ]
  }
]


const MaintenanceChecklist = () => {
  const navigation = useNavigation()
  const [expandedSections, setExpandedSections] = useState({})
  const [checkedItems, setCheckedItems] = useState({})
  const [notes, setNotes] = useState({})
  const [animations] = useState(() =>
    checklistData.reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: new Animated.Value(0),
      }),
      {}
    )
  )

  const toggleSection = useCallback(
    (sectionId) => {
      const toValue = expandedSections[sectionId] ? 0 : 1
      Animated.spring(animations[sectionId], {
        toValue,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start()

      setExpandedSections((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }))
    },
    [expandedSections, animations]
  )

  const toggleItem = useCallback((itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }, [])

  const updateNote = useCallback((sectionId, subsectionIndex, text) => {
    setNotes((prev) => ({
      ...prev,
      [`${sectionId}${subsectionIndex !== undefined ? `-${subsectionIndex}` : ''}`]: text,
    }))
  }, [])

  const getProgress = useCallback(
    (items) => {
      const checkedCount = items.filter((item) => checkedItems[item.id]).length
      return { count: checkedCount, total: items.length }
    },
    [checkedItems]
  )

  const renderProgressBar = useCallback(
    (items) => {
      const { count, total } = getProgress(items)
      const percentage = (count / total) * 100

      return (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          <Text style={styles.progressText}>{`${count}/${total}`}</Text>
        </View>
      )
    },
    [getProgress]
  )

  const renderItems = useCallback(
    (items, sectionId, subsectionIndex) => (
      <View style={styles.itemsContainer}>
        {items.map((item) => (
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
            <Text style={[styles.itemText, checkedItems[item.id] && styles.checkedItemText]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [checkedItems, toggleItem]
  )

  const renderNoteInput = useCallback(
    (sectionId, subsectionIndex) => (
      <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Nota:</Text>
        <TextInput
          style={styles.noteInput}
          multiline
          placeholder="Agregar nota..."
          value={notes[`${sectionId}${subsectionIndex !== undefined ? `-${subsectionIndex}` : ''}`]}
          onChangeText={(text) => updateNote(sectionId, subsectionIndex, text)}
        />
      </View>
    ),
    [notes, updateNote]
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      {/*<Text style={styles.title}>Checklist de Mantenimiento</Text>*/}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {checklistData.map((section) => (
            <Animated.View
              key={section.id}
              style={[
                styles.section,
                {
                  transform: [
                    {
                      scale: animations[section.id].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.02],
                      }),
                    },
                  ],
                },
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
              </TouchableOpacity>

              {expandedSections[section.id] && (
                <View>
                  {section.sections ? (
                    section.sections.map((subsection, index) => (
                      <View key={index} style={styles.subsection}>
                        <Text style={styles.subtitle}>{subsection.subtitle}</Text>
                        {renderItems(subsection.items, section.id, index)}
                        {subsection.hasNote && renderNoteInput(section.id, index)}
                      </View>
                    ))
                  ) : (
                    <>
                      {renderItems(section.items, section.id)}
                      {section.hasNote && renderNoteInput(section.id)}
                    </>
                  )}
                </View>
              )}
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("FormMontaje")} activeOpacity={0.8}>
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
    fontSize: 24,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  subsection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    marginVertical: 8,
  },
  itemsContainer: {
    marginTop: 8,
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
  noteContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e2e8f0",
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