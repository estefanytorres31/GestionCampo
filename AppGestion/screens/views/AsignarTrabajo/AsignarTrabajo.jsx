import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Input from "../../components/Input";
import Select from "../../components/Select";
import useUsuarioTecnico from "../../hooks/UsuarioTecnico/useUsuarioTecnico";
import usePuerto from "../../hooks/Puerto/usePuerto";
import useOrdenTrabajo from "../../hooks/OrdenTrabajo/useOrdenTrabajo";
import useOrdenTrabajoUsuario from "../../hooks/OrdenTrabajoUsuario/useOrdenTrabajoUsuario";
import useOrdenTrabajoSistema from "../../hooks/OrdenTrabajoSistema/useOrdenTrabajoSistema";
import useOrdenTrabajoParte from "../../hooks/OrdenTrabajoParte/useOrdenTrabajoParte";
import useTipoTrabajoESP from "../../hooks/TipoTrabajoESP/useTipoTrabajoESP"
import { CommonActions } from '@react-navigation/native';

  const AsignarTrabajoScreen = ({route, navigation }) => {
    const {codigoOT, ordenTrabajo }=route.params;
    const [puerto, setPuerto] = useState(null);
    const [tecnico, setTecnico] = useState(null);
    const [motorista, setMotorista] = useState("");
    const [supervisor, setSupervisor] = useState("");
    const [ayudantes, setAyudantes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const { usuariosTecnicos } = useUsuarioTecnico();
    const { puertos } = usePuerto();
    const { updateOT, loading, error } = useOrdenTrabajo(); 
    const { guardarOrdenTrabajoUsuario, asignarOrdenTrabajo } = useOrdenTrabajoUsuario();
  
    const [puertosOptions, setPuertosOptions] = useState([]);
  
    useEffect(() => {
      const options = puertos.map((puerto) => ({
        label: puerto.nombre,
        value: puerto.id_puerto,
      }));
      setPuertosOptions(options);
    }, [puertos]);
  
    const handleSeleccionarTecnico = () => {
      navigation.navigate("SeleccionarTecnico", {
        tecnicoSeleccionado: tecnico,
        onSelect: (nuevoTecnico) => setTecnico(nuevoTecnico),
        usuariosExcluidos: ayudantes.map((a) => a.id),
      });
    };
  
    const handleSeleccionarAyudantes = () => {
      navigation.navigate("SeleccionarAyudantes", {
        ayudantesSeleccionados: ayudantes,
        onSelect: (nuevosAyudantes) => setAyudantes(nuevosAyudantes),
        usuarioExcluido: tecnico ? [tecnico.id] : [],
      });
    };
  
  
    const handleGuardar = async () => {
      if (!puerto) {
        alert("Debe seleccionar un puerto.");
        return;
      }
      
      try {
        console.log('Puerto: ',puerto)
        console.log(ordenTrabajo.id_orden_trabajo)
        const response = await updateOT(
          ordenTrabajo.id_orden_trabajo,
          puerto
        );
  
        if (response) {
  
          const usuariosAsignados = [
            {
                id_usuario: tecnico.id,
                rol_en_orden: "Responsable",
            },
            ...ayudantes.map(ayudante => ({
                id_usuario: ayudante.id,
                rol_en_orden: "Ayudante",
            }))
        ];
        
        await asignarOrdenTrabajo(ordenTrabajo.id_orden_trabajo, usuariosAsignados);
        
    
        alert("Orden de trabajo y usuarios asociados guardados con éxito");
        navigation.navigate('Mantto',{idOrden:ordenTrabajo.id_orden_trabajo})
        }
      } catch (error) {
        alert("Error al guardar la orden de trabajo: " + error);
        console.log(error);
      }
    };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.header}>
        <Text style={styles.title}>Formulario</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Código de OT</Text>
          <Text style={styles.infoText}>{codigoOT}</Text>
        </View>

      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Puerto</Text>
          <Select
            placeholder="Seleccione un puerto"
            items={puertosOptions}
            value={puerto}
            onValueChange={setPuerto}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Técnico</Text>
          <TouchableOpacity 
            style={[styles.button, tecnico && styles.buttonSelected]} 
            onPress={handleSeleccionarTecnico}
          >
            <Text style={styles.buttonText}>
              {tecnico ? tecnico.nombre_completo : "Seleccionar Técnico"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apoyo (Ayudantes)</Text>
          <TouchableOpacity 
            style={[styles.button, ayudantes.length > 0 && styles.buttonSelected]} 
            onPress={handleSeleccionarAyudantes}
          >
            <Text style={styles.buttonText}>Seleccionar Ayudantes</Text>
          </TouchableOpacity>
          <View style={styles.ayudantesContainer}>
            {ayudantes.length > 0 ? (
              ayudantes.map((ayudante, index) => (
                <View key={index} style={styles.ayudanteItem}>
                  <Text style={styles.ayudanteText}>{ayudante.nombre_completo}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No hay ayudantes seleccionados</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Motorista (Opcional)</Text>
          <Input 
            placeholder="Ingrese el nombre del motorista" 
            value={motorista} 
            onChangeText={setMotorista}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Supervisor (Opcional)</Text>
          <Input 
            placeholder="Ingrese el nombre del supervisor" 
            value={supervisor} 
            onChangeText={setSupervisor}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleGuardar}
      >
        <Text style={styles.saveButtonText}>GUARDAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A237E",
    textAlign: "center",
    fontFamily: "System",
    marginBottom: 8,
  },
  divider: {
    height: 4,
    backgroundColor: "#1A237E",
    width: 60,
    alignSelf: "center", 
    borderRadius: 2,
  },
  card: {
    backgroundColor: "#FFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 12.5,
    color: "#333",
    fontWeight: "500",
  },
  systemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  systemItem: {
    backgroundColor: "#E8EAF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  systemText: {
    color: "#3949AB",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#5C6BC0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonSelected: {
    backgroundColor: "#3949AB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ayudantesContainer: {
    marginTop: 8,
  },
  ayudanteItem: {
    backgroundColor: "#E8EAF6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  ayudanteText: {
    color: "#3949AB",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    fontStyle: "italic",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default AsignarTrabajoScreen;
