import React,{useState,  useEffect} from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuth from "../../hooks/Auth/useAuth";
import useOrdenTrabajoUsuario from "../../hooks/OrdenTrabajoUsuario/useOrdenTrabajoUsuario";

const { width } = Dimensions.get("window");

const Inicio = ({ route, navigation }) => {
  const { logout, role } = useAuth();
  const { getOrdenTrabajoUsuarioByUsuario } = useOrdenTrabajoUsuario();
  const [isResponsable, setIsResponsable] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const response = await getOrdenTrabajoUsuarioByUsuario();
      const hasResponsableRole = response.some(
        assignment => assignment.rol_en_orden === "Responsable"
      );
      setIsResponsable(hasResponsableRole);
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const handleLogout = () => {
    logout();
  };

  const showLogoutButton = role && !role.includes("Jefe");

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#1A2980", "#26D0CE"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>¡Bienvenido!</Text>
              <Text style={styles.headerTitle}>Panel Principal</Text>
              <Text style={styles.headerSubtitle}>
                Selecciona una opción para comenzar
              </Text>
            </View>

            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("QRScann", {
                    // idOrden
                  })
                }
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={32}
                      color="#1A2980"
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Escanear QR</Text>
                    <View style={styles.chevron} />
                  </View>
                </View>
              </TouchableOpacity>

              {isResponsable && (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate("TrabajosAsignados")}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name="clipboard-list"
                        size={32}
                        color="#1A2980"
                      />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>Lista de OT</Text>
                      <View style={styles.chevron} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {showLogoutButton && (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color="#fff"
                  style={styles.logoutIcon}
                />
                <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 48,
  },
  header: {
    alignItems: "center",
    marginTop: 24,
  },
  welcomeText: {
    fontSize: 28,
    color: "#26D0CE",
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  cardContainer: {
    marginTop: 36,
  },
  card: {
    borderRadius: 24,
    marginBottom: 16,
    height: 110,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: "hidden",
    transform: [{ scale: 1 }],
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    height: "100%",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(38, 208, 206, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
  },
  cardTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A2980",
    letterSpacing: 0.3,
  },
  chevron: {
    width: 10,
    height: 10,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: "#1A2980",
    transform: [{ rotate: "45deg" }],
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 48,
    elevation: 4,
    shadowColor: "#FF3B30",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
});

export default Inicio;
