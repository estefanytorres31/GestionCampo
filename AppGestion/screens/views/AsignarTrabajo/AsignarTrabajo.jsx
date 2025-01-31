import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Input from "../../components/Input";
import Select from "../../components/Select";
import useUsuarioTecnico from "../../hooks/UsuarioTecnico/useUsuarioTecnico";
import usePuerto from "../../hooks/Puerto/usePuerto";
import useOrdenTrabajo from "../../hooks/OrdenTrabajo/useOrdenTrabajo";
import useOrdenTrabajoUsuario from "../../hooks/OrdenTrabajoUsuario/useOrdenTrabajoUsuario";

const AsignarTrabajoScreen = ({route, navigation }) => {
  const {sistemas,empresa,embarcacion,trabajo,codigoOT }=route.params;
  const [puerto, setPuerto] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [motorista, setMotorista] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [ayudantes, setAyudantes] = useState([]);

  const { usuariosTecnicos } = useUsuarioTecnico();
  const { puertos } = usePuerto();
  const { guardarOrdenTrabajo, loading, error } = useOrdenTrabajo(); 
  const { guardarOrdenTrabajoUsuario } = useOrdenTrabajoUsuario();

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
    if (!tecnico || !puerto) {
      alert("Debe seleccionar un técnico y un puerto.");
      return;
    }
    
    try {
      const response = await guardarOrdenTrabajo(
        trabajo.id_tipo_trabajo,
        embarcacion.id_embarcacion,
        puerto,
        codigoOT,
        motorista || null,
        supervisor || null
      );

      console.log({
        trabajoId: trabajo.id_tipo_trabajo,
        embarcacionId: embarcacion.id_embarcacion,
        puerto,
        codigoOT,
        motorista: motorista || null,
        supervisor: supervisor || null
      });

      if (response) {
        console.log(response.id_orden_trabajo)
        console.log(tecnico.id)
        console.log(ayudantes.map((a) => a.id))
        await guardarOrdenTrabajoUsuario(response.id_orden_trabajo, tecnico.id, "Responsable");

        // Luego guardamos los ayudantes con rol de ayudante
        for (let ayudante of ayudantes) {
          await guardarOrdenTrabajoUsuario(response.id_orden_trabajo, ayudante.id, "Ayudante");
        }
  
        alert("Orden de trabajo y usuarios asociados guardados con éxito");
        navigation.goBack();
      }
    } catch (error) {
      alert("Error al guardar la orden de trabajo: " + error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Asignar Trabajo</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Código de OT:</Text>
        <Text style={styles.selectedText}>{codigoOT}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Trabajo:</Text>
        <Text style={styles.selectedText}>{trabajo.nombre_trabajo}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Sistemas:</Text>
        {sistemas.length > 0 ? (
          sistemas.map((sistema, index) => (
            <Text key={index} style={styles.selectedText}>
              • {sistema.nombre_sistema}
            </Text>
          ))
        ) : (
          <Text style={styles.selectedText}>No hay sistemas seleccionados</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Puerto:</Text>
        <Select
          placeholder="Seleccione un puerto"
          items={puertosOptions}
          value={puerto}
          onValueChange={setPuerto}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Técnico:</Text>
        <TouchableOpacity style={styles.button} onPress={handleSeleccionarTecnico}>
          <Text style={styles.buttonText}>
            {tecnico ? tecnico.nombre_completo : "Seleccionar Técnico"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Apoyo (Ayudantes):</Text>
        <TouchableOpacity style={styles.button} onPress={handleSeleccionarAyudantes}>
          <Text style={styles.buttonText}>Seleccionar Ayudantes</Text>
        </TouchableOpacity>
        {ayudantes.length > 0 && (
          <Text style={styles.selectedText}>
            {ayudantes.length} ayudantes seleccionados
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Motorista (Opcional):</Text>
        <Input placeholder="Ingrese el nombre del motorista" value={motorista} onChangeText={setMotorista} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Supervisor (Opcional):</Text>
        <Input placeholder="Ingrese el nombre del supervisor" value={supervisor} onChangeText={setSupervisor} />
      </View>

      <TouchableOpacity style={styles.buttonSave} onPress={handleGuardar}>
        <Text style={styles.buttonText}>GUARDAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#F5F6F8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  field: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#333" },
  button: { backgroundColor: "#5c6bc0", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginVertical: 8 },
  buttonSave: { marginTop: 20, backgroundColor: "#2E7D32", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  selectedText: { fontSize: 14, color: "#333", marginTop: 2, marginLeft:10 },
});

export default AsignarTrabajoScreen;
