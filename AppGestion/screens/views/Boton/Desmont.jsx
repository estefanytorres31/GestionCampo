import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useRef, useState } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const ButtonsScreen = () => {
  const navigation = useNavigation()
  const [activeButton, setActiveButton] = useState(null)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = (buttonId) => {
    setActiveButton(buttonId)
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    setActiveButton(null)
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = (screen) => {
    navigation.navigate(screen)
  }

  const renderButton = (title, icon, gradientColors, screen, buttonId) => {
    const isActive = activeButton === buttonId
    
    return (
      <TouchableOpacity
        onPressIn={() => handlePressIn(buttonId)}
        onPressOut={handlePressOut}
        onPress={() => handlePress(screen)}
        activeOpacity={0.9}
        style={styles.buttonWrapper}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Feather
                name={icon}
                size={24}
                color="white"
              />
            </View>
            <Text style={styles.buttonText}>{title}</Text>
            {isActive && <View style={styles.ripple} />}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f5f7fa", "#e8ecf1"]}
        style={styles.background}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Sistema de Montaje</Text>
        <Text style={styles.subtitle}>Seleccione una opción</Text>
        {renderButton(
          "Montaje",
          "download",
          ["#2575fc", "#3336ff"],
          "Montaje",
          "montaje-entrada"
        )}
        {renderButton(
          "Desmontaje",
          "upload",
          ["#3336ff", "#2575fc"],
          "Montaje",
          "montaje-salida"
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  buttonWrapper: {
    width: width * 0.85,
    maxWidth: 340,
    marginVertical: 12,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    height: 80,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  ripple: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})

export default ButtonsScreen