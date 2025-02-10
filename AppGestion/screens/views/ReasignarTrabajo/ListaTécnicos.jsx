import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useUsuarioTecnico from "../../hooks/UsuarioTecnico/useUsuarioTecnico";

export const SeleccionarTecnicoReasignarScreen = ({ route, navigation }) => {
  const { usuarioActual, onSelect } = route.params;
  const { usuariosTecnicos } = useUsuarioTecnico();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filteredData = usuariosTecnicos.filter(
    (u) =>
      u.id !== usuarioActual?.id_usuario &&
      u.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionar = (usuario) => {
    setSeleccionado(usuario);
  };

  const handleGuardar = () => {
    if (seleccionado) {
      onSelect(seleccionado);
      navigation.goBack();
    } else {
      alert("Por favor seleccione un técnico");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>Reasignar Técnico</Text>
        <View style={styles.currentUser}>
          <Text style={styles.currentUserLabel}>Usuario Actual:</Text>
          <Text style={styles.currentUserName}>{usuarioActual?.nombre_completo}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Buscar técnico"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <ScrollView contentContainerStyle={styles.list}>
          {filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                seleccionado?.id === item.id && styles.itemSelected,
              ]}
              onPress={() => handleSeleccionar(item)}
            >
              <View style={styles.itemContent}>
                <Ionicons name="person-outline" size={28} color="white" />
                <Text style={styles.itemText}>{item.nombre_completo}</Text>
                {seleccionado?.id === item.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGuardar}
        >
          <Text style={styles.buttonText}>Confirmar Reasignación</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export const SeleccionarAyudantesReasignarScreen = ({ route, navigation }) => {
  const { ayudantesActuales, usuarioResponsable, onSelect } = route.params;
  const { usuariosTecnicos } = useUsuarioTecnico();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const filteredData = usuariosTecnicos.filter(
    (u) =>
      u.id !== usuarioResponsable?.id_usuario &&
      !ayudantesActuales.some(a => a.id_usuario === u.id) &&
      u.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionar = (usuario) => {
    setSeleccionados((prev) =>
      prev.some((item) => item.id === usuario.id)
        ? prev.filter((item) => item.id !== usuario.id)
        : [...prev, usuario]
    );
  };

  const handleGuardar = () => {
    onSelect(seleccionados);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>Reasignar Ayudantes</Text>
        <View style={styles.currentUser}>
          <Text style={styles.currentUserLabel}>Ayudantes Actuales:</Text>
          {ayudantesActuales.map(ayudante => (
            <Text key={ayudante.id_usuario} style={styles.currentUserName}>
              {ayudante.nombre_completo}
            </Text>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Buscar ayudantes"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <ScrollView contentContainerStyle={styles.list}>
          {filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                seleccionados.some((u) => u.id === item.id) && styles.itemSelected,
              ]}
              onPress={() => handleSeleccionar(item)}
            >
              <View style={styles.itemContent}>
                <Ionicons name="person-outline" size={28} color="white" />
                <Text style={styles.itemText}>{item.nombre_completo}</Text>
                {seleccionados.some((u) => u.id === item.id) && (
                  <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Confirmar Reasignación</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  currentUser: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  currentUserLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  currentUserName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
  },
  item: {
    backgroundColor: "#00796B",
    marginVertical: 10,
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemSelected: {
    backgroundColor: "#5E8E7B",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  itemText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    flex: 1,
  },
  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});