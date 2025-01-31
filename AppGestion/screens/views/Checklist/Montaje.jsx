import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"

const MaintenanceChecklist = () => {
  const [activeChecklist, setActiveChecklist] = useState(null)

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Maintenance Checklist</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setActiveChecklist("desmontaje")}>
          <Text style={styles.buttonText}>Desmontaje</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setActiveChecklist("montaje")}>
          <Text style={styles.buttonText}>Montaje</Text>
        </TouchableOpacity>
      </View>
      {activeChecklist && (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Existing checklist content */}
          <Text>Checklist Item 1</Text>
          <Text>Checklist Item 2</Text>
          <Text>Checklist Item 3</Text>
        </ScrollView>
      )}
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
}

export default MaintenanceChecklist

