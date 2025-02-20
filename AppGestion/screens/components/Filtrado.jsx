import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Filtrado = ({ empresas, ordenes, fetchEmbarcacionesByEmpresa, onOrdersFiltered }) => {
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedEmbarcacion, setSelectedEmbarcacion] = useState('');
  const [embarcaciones, setEmbarcaciones] = useState([]);

  useEffect(() => {
    if (selectedEmpresa) {
      const loadEmbarcaciones = async () => {
        try {
          const data = await fetchEmbarcacionesByEmpresa(selectedEmpresa);
          setEmbarcaciones(data);
        } catch (error) {
          console.error('Error al cargar embarcaciones:', error);
          setEmbarcaciones([]);
        }
      };
      loadEmbarcaciones();
    } else {
      setEmbarcaciones([]);
      setSelectedEmbarcacion('');
    }
  }, [selectedEmpresa]);

  useEffect(() => {
    let filteredOrders = [...ordenes];

    if (selectedEmbarcacion) {
      filteredOrders = ordenes.filter(orden => 
        orden.id_embarcacion && orden.id_embarcacion.toString() === selectedEmbarcacion.toString()
      );
    } else if (selectedEmpresa) {
      // Check if orders should be filtered by company
      const empresaOrders = ordenes.filter(orden => 
        orden.id_empresa && orden.id_empresa.toString() === selectedEmpresa.toString()
      );
      
      if (empresaOrders.length > 0) {
        filteredOrders = empresaOrders;
      }
    } else {
      filteredOrders = ordenes;
    }

    onOrdersFiltered(filteredOrders);
  }, [selectedEmbarcacion, selectedEmpresa, ordenes]);

  const handleEmpresaChange = (empresaId) => {
    setSelectedEmpresa(empresaId);
    setSelectedEmbarcacion('');
    
    if (empresaId) {
      const empresaOrders = ordenes.filter(orden => 
        orden.id_empresa && orden.id_empresa.toString() === empresaId.toString()
      );
      onOrdersFiltered(empresaOrders);
    } else {
      onOrdersFiltered(ordenes);
    }
  };

  const handleEmbarcacionChange = (embarcacionId) => {
    setSelectedEmbarcacion(embarcacionId);
    
    if (embarcacionId) {
      const embarcacionOrders = ordenes.filter(orden => 
        orden.id_embarcacion && orden.id_embarcacion.toString() === embarcacionId.toString()
      );
      onOrdersFiltered(embarcacionOrders);
    } else if (selectedEmpresa) {
      const empresaOrders = ordenes.filter(orden => 
        orden.id_empresa && orden.id_empresa.toString() === selectedEmpresa.toString()
      );
      onOrdersFiltered(empresaOrders);
    } else {
      onOrdersFiltered(ordenes);
    }
  };

  const handleClearFilters = () => {
    setSelectedEmpresa('');
    setSelectedEmbarcacion('');
    setEmbarcaciones([]);
    onOrdersFiltered(ordenes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Filtros</Text>
        <TouchableOpacity 
          onPress={handleClearFilters}
          style={styles.clearButton}
        >
          <MaterialCommunityIcons name="filter-off" size={20} color="#250b8d" />
          <Text style={styles.clearButtonText}>Limpiar filtros</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Empresa</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedEmpresa}
            onValueChange={handleEmpresaChange}
            style={styles.pickerInput}
          >
            <Picker.Item label="Seleccione una empresa" value="" />
            {empresas.map((empresa) => (
              <Picker.Item 
                key={empresa.id} 
                label={empresa.nombre} 
                value={empresa.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {selectedEmpresa && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Embarcación</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedEmbarcacion}
              onValueChange={handleEmbarcacionChange}
              style={styles.pickerInput}
            >
              <Picker.Item label="Seleccione una embarcación" value="" />
              {embarcaciones.map((embarcacion) => (
                <Picker.Item
                  key={embarcacion.id_embarcacion}
                  label={embarcacion.nombre}
                  value={embarcacion.id_embarcacion}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  clearButtonText: {
    marginLeft: 4,
    color: '#250b8d',
    fontWeight: '600',
    fontSize: 14,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  pickerInput: {
    height: 60,
  }
});

export default Filtrado;