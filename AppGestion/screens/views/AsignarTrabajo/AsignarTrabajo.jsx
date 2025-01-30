import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Input from "../../components/Input";
import Select from "../../components/Select";
import useUsuarioTecnico from "../../hooks/UsuarioTecnico/useUsuarioTecnico";

const AsignarTrabajoScreen = ({ navigation }) => {
  const [puerto, setPuerto] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [motorista, setMotorista] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [ayudantes, setAyudantes] = useState([]);

  const { usuariosTecnicos } = useUsuarioTecnico(); // Obtener usuarios técnicos del contexto
  const [tecnicosOptions, setTecnicosOptions] = useState([]);

  const puertos = [
    { label: "Puerto 1", value: "puerto1" },
    { label: "Puerto 2", value: "puerto2" },
  ];

  useEffect(() => {
    // Convertir los usuarios técnicos en opciones para el Select
    const options = usuariosTecnicos.map((usuario) => ({
      label: usuario.nombre_completo,
      value: usuario.id,
    }));
    setTecnicosOptions(options);
  }, [usuariosTecnicos]);

  const handleSeleccionarAyudantes = () => {
    navigation.navigate("SeleccionarAyudantes", {
      ayudantesSeleccionados: ayudantes,
      onSelect: (nuevosAyudantes) => setAyudantes(nuevosAyudantes),
    });
  };

  const handleGuardar = () => {
    console.log("Puerto:", puerto);
    console.log("Técnico:", tecnico);
    console.log("Motorista:", motorista);
    console.log("Supervisor:", supervisor);
    console.log("Ayudantes:", ayudantes);
    alert("Formulario guardado correctamente.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Asignar Trabajo</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Puerto:</Text>
        <Select
          placeholder="Seleccione un puerto"
          items={puertos}
          value={puerto}
          onValueChange={setPuerto}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Técnico:</Text>
        <Select
          placeholder="Seleccione un técnico"
          items={tecnicosOptions}
          value={tecnico}
          onValueChange={setTecnico}
        />
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
        <Text style={styles.label}>Motorista:</Text>
        <Input
          placeholder="Ingrese el nombre del motorista"
          value={motorista}
          onChangeText={setMotorista}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Supervisor:</Text>
        <Input
          placeholder="Ingrese el nombre del supervisor"
          value={supervisor}
          onChangeText={setSupervisor}
        />
      </View>

      <TouchableOpacity style={styles.buttonSave} onPress={handleGuardar}>
        <Text style={styles.buttonText}>GUARDAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F6F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  button: {
    backgroundColor: "#5c6bc0",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonSave: {
    marginTop: 20,
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});

export default AsignarTrabajoScreen;
