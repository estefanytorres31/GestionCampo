import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const Abordaje = () => {
  const reportData = {
    tipoTrabajo: "Mantenimiento Preventivo",
    codigoOT: "OT-2025-001",
    empresa: "Naviera Pacífico S.A.",
    embarcacion: "Pacific Star",
    puerto: "Puerto Principal",
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    tecnico: "Solangel Tisza",
    ayudante: "Estefany Torres",
    motorista: "Yoiber Sanchez",
    supervisor: "Sergio Dueñas"
  };

  const [checklist, setChecklist] = useState([
    { id: 1, descripcion: "Verificación inicial de equipos", completado: false },
    { id: 2, descripcion: "Inspección de sistemas", completado: false },
    { id: 3, descripcion: "Pruebas de funcionamiento", completado: false }
  ]);

  const [formData, setFormData] = useState({
    estadoGeneral: "",
    observaciones: "",
    recomendaciones: ""
  });

  const handleChecklistToggle = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completado: !item.completado } : item
    ));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadPDF = () => {
    console.log("Descargando PDF...", { reportData, checklist, formData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{reportData.tipoTrabajo}</Text>
          


          
          </View>

          {/* Main Information */}
          <View style={styles.infoGrid}>
            <InfoItem label="Código OT" value={reportData.codigoOT} />
            <InfoItem label="Empresa" value={reportData.empresa} />
            <InfoItem label="Embarcación" value={reportData.embarcacion} />
            <InfoItem label="Puerto" value={reportData.puerto} />
            <InfoItem label="Fecha y Hora" value={`${reportData.fecha} - ${reportData.hora}`} />
          </View>

          {/* Personnel Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Asignado</Text>
            <View style={styles.personnelGrid}>
              <PersonnelItem label="Técnico" value={reportData.tecnico} />
              <PersonnelItem label="Ayudante" value={reportData.ayudante} />
              <PersonnelItem label="Motorista" value={reportData.motorista} />
              <PersonnelItem label="Supervisor" value={reportData.supervisor} />
            </View>
          </View>

          {/* Checklist Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Checklist de Trabajo</Text>
            {checklist.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => handleChecklistToggle(item.id)}
              >
                <View style={[
                  styles.checkbox,
                  item.completado && styles.checkboxChecked
                ]} />
                <Text style={[
                  styles.checklistText,
                  item.completado && styles.checklistTextCompleted
                ]}>
                  {item.descripcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* System Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formulario del Sistema</Text>
            <FormField
              label="Estado General"
              value={formData.estadoGeneral}
              onChange={(value) => handleFormChange('estadoGeneral', value)}
            />
            <FormField
              label="Observaciones"
              value={formData.observaciones}
              onChange={(value) => handleFormChange('observaciones', value)}
            />
            <FormField
              label="Recomendaciones"
              value={formData.recomendaciones}
              onChange={(value) => handleFormChange('recomendaciones', value)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper Components
const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const PersonnelItem = ({ label, value }) => (
  <View style={styles.personnelItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const FormField = ({ label, value, onChange }) => (
  <View style={styles.formField}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={`Ingrese ${label.toLowerCase()}...`}
      multiline
      numberOfLines={3}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  downloadButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  infoGrid: {
    marginTop: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 16,
  },
  personnelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  personnelItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
  },
  checklistText: {
    fontSize: 16,
    color: '#1f2937',
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  formField: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
  },
});

export default Abordaje;