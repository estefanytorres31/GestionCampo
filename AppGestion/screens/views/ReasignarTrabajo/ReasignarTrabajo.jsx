import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useOrdenTrabajoUsuario from "../../hooks/OrdenTrabajoUsuario/useOrdenTrabajoUsuario";
import useUsuarioTecnico from "../../hooks/UsuarioTecnico/useUsuarioTecnico";

const ReasignarTrabajoScreen = ({ route, navigation }) => {
  const { idOrden } = route.params;
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getOrdenTrabajoUsuarioByOrden, reasignarOTOtroUsuario } = useOrdenTrabajoUsuario();
  const { getUsuarioById } = useUsuarioTecnico();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await getOrdenTrabajoUsuarioByOrden(idOrden);
      if (response) {
        const usuariosConNombre = await Promise.all(
          response.map(async (usuario) => {
            const usuarioData = await getUsuarioById(usuario.id_usuario);
            return {
              ...usuario,
              nombre_completo: usuarioData?.nombre_completo || "Desconocido",
            };
          })
        );

        const usuariosOrdenados = usuariosConNombre.sort((a, b) =>
          a.rol_en_orden === "Responsable" ? -1 : 1
        );

        setUsuarios(usuariosOrdenados);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
      setIsLoading(false);
    }
  };

  const handleReasignarResponsable = () => {
    const responsable = usuarios.find(u => u.rol_en_orden === "Responsable");
    navigation.navigate("SeleccionarTecnicoReasignar", {
      usuarioActual: responsable,
      onSelect: async (nuevoTecnico) => {
        try {
          const nuevosUsuarios = usuarios.map(u => {
            if (u.rol_en_orden === "Responsable") {
              return {
                id_usuario: nuevoTecnico.id,
                rol_en_orden: "Responsable",
                observaciones: u.observaciones || "Responsable de supervisión general."
              };
            }
            return {
              id_usuario: u.id_usuario,
              rol_en_orden: u.rol_en_orden,
              observaciones: u.observaciones || "Responsable de supervisión general."
            };
          });

          await reasignarOTOtroUsuario(idOrden, nuevosUsuarios);
          Alert.alert("Éxito", "Responsable reasignado correctamente");
          cargarUsuarios();
        } catch (error) {
          console.error("Error al reasignar responsable:", error);
          Alert.alert("Error", "No se pudo reasignar el responsable");
        }
      }
    });
  };

  const handleReasignarAyudantes = () => {
    const responsable = usuarios.find(u => u.rol_en_orden === "Responsable");
    const ayudantes = usuarios.filter(u => u.rol_en_orden === "Ayudante");
    
    navigation.navigate("SeleccionarAyudantesReasignar", {
      ayudantesActuales: ayudantes,
      usuarioResponsable: responsable,
      onSelect: async (nuevosAyudantes) => {
        try {
          const nuevosUsuarios = [
            {
              id_usuario: responsable.id_usuario,
              rol_en_orden: "Responsable",
              observaciones: responsable.observaciones || "Responsable de supervisión general."
            },
            ...nuevosAyudantes.map(ayudante => ({
              id_usuario: ayudante.id,
              rol_en_orden: "Ayudante",
              observaciones: "Ayudante en el trabajo."
            }))
          ];

          await reasignarOTOtroUsuario(idOrden, nuevosUsuarios);
          Alert.alert("Éxito", "Ayudantes reasignados correctamente");
          cargarUsuarios();
        } catch (error) {
          console.error("Error al reasignar ayudantes:", error);
          Alert.alert("Error", "No se pudieron reasignar los ayudantes");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5c6bc0" />
      </View>
    );
  }

  const responsable = usuarios.find(u => u.rol_en_orden === "Responsable");
  const ayudantes = usuarios.filter(u => u.rol_en_orden === "Ayudante");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reasignar Trabajo</Text>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Responsable Actual</Text>
          <TouchableOpacity 
            style={styles.reasignarButton}
            onPress={handleReasignarResponsable}
          >
            <Ionicons name="swap-horizontal" size={20} color="white" />
            <Text style={styles.buttonText}>Reasignar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userCard}>
          <Ionicons name="person" size={24} color="#00796B" />
          <Text style={styles.userName}>{responsable?.nombre_completo}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ayudantes Actuales</Text>
          <TouchableOpacity 
            style={styles.reasignarButton}
            onPress={handleReasignarAyudantes}
          >
            <Ionicons name="swap-horizontal" size={20} color="white" />
            <Text style={styles.buttonText}>Reasignar</Text>
          </TouchableOpacity>
        </View>
        {ayudantes.length > 0 ? (
          ayudantes.map((ayudante) => (
            <View key={ayudante.id_orden_trabajo_usuario} style={styles.userCard}>
              <Ionicons name="person-outline" size={24} color="#00796B" />
              <Text style={styles.userName}>{ayudante.nombre_completo}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay ayudantes asignados</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
    flex: 1,
  },
  reasignarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00796B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default ReasignarTrabajoScreen;