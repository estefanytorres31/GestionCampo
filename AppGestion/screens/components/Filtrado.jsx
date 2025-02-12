import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Filtrado = ({ empresas, ordenes, fetchEmbarcacionesByEmpresa, onOrdersFiltered }) => {
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedEmbarcacion, setSelectedEmbarcacion] = useState('');
  const [embarcaciones, setEmbarcaciones] = useState([]);

  // Cargar embarcaciones cuando se selecciona una empresa
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

  // Efecto para filtrar órdenes cuando cambia la embarcación seleccionada
  useEffect(() => {
    let filteredOrders = [...ordenes];

    // Si hay una embarcación seleccionada, filtrar por ella
    if (selectedEmbarcacion) {
      filteredOrders = ordenes.filter(orden => 
        orden.id_embarcacion && orden.id_embarcacion.toString() === selectedEmbarcacion.toString()
      );
    } else {
      // Si no hay embarcación seleccionada pero hay empresa, mostrar todas las órdenes
      filteredOrders = ordenes;
    }

    // Enviar las órdenes filtradas al componente padre
    onOrdersFiltered(filteredOrders);
  }, [selectedEmbarcacion, ordenes]);

  const handleEmpresaChange = (empresaId) => {
    setSelectedEmpresa(empresaId);
    setSelectedEmbarcacion(''); // Resetear la embarcación seleccionada
    onOrdersFiltered(ordenes); // Resetear el filtro
  };

  const handleEmbarcacionChange = (embarcacionId) => {
    setSelectedEmbarcacion(embarcacionId);
  };

  return (
    <View style={styles.container}>
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
    height: 50,
  }
});

export default Filtrado;