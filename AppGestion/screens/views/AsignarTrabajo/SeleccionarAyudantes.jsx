import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useUsuarioTecnico from "../../hooks/UsuarioTecnico/useUsuarioTecnico";

const SeleccionarAyudantesScreen = ({ route, navigation }) => {
  const { ayudantesSeleccionados, onSelect } = route.params;
  const { usuariosTecnicos } = useUsuarioTecnico();

  const [busqueda, setBusqueda] = useState("");
  const [seleccionados, setSeleccionados] = useState(ayudantesSeleccionados || []);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
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
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.title}>Seleccionar Ayudantes</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar usuarios"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <FlatList
          data={usuariosTecnicos.filter((u) =>
            u.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar Selección</Text>
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

export default SeleccionarAyudantesScreen;
