import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

const ButtonsScreen = () => {
  const navigation = useNavigation()

  const handlePress = (screen) => {
    navigation.navigate(screen)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.desmontajeButton]}
        onPress={() => handlePress("Montaje")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Desmontaje</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.montajeButton]}
        onPress={() => handlePress("Montaje")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Montaje</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  button: {
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  desmontajeButton: {
    backgroundColor: "#FF6B6B",
  },
  montajeButton: {
    backgroundColor: "#4ECDC4",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default ButtonsScreen

