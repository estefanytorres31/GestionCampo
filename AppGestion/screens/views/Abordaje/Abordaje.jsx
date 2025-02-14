import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput } from 'react-native';
import { Checkbox, Button } from 'react-native-paper';
import { Download } from 'lucide-react-native';

const Abordaje =({ route })  => {
    const { idOrden } = route.params
  const reportData = {
    logoUrl: "https://media.licdn.com/dms/image/v2/D4E03AQHP5SGxw__fyg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1709238131266?e=2147483647&v=beta&t=vogCwG6YzyXMsfRRcB-grCotNTVAgZn_4zc3_29hYMg",
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

  const [sistemaForm, setSistemaForm] = useState([
    { id: 1, campo: "Estado general", valor: "" },
    { id: 2, campo: "Observaciones", valor: "" },
    { id: 3, campo: "Recomendaciones", valor: "" }
  ]);

  const handleDownloadPDF = () => {
    console.log("Descargando PDF...");
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={{ uri: reportData.logoUrl }} style={{ width: 80, height: 80, borderRadius: 40 }} />
      </View>

      <Button mode="contained" onPress={handleDownloadPDF} icon={() => <Download size={20} color="white" />}>
        Descargar PDF
      </Button>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 20 }}>{reportData.tipoTrabajo}</Text>
      
      <View style={{ marginBottom: 20 }}>
        <Text>Código OT: {reportData.codigoOT}</Text>
        <Text>Empresa: {reportData.empresa}</Text>
        <Text>Embarcación: {reportData.embarcacion}</Text>
        <Text>Puerto: {reportData.puerto}</Text>
        <Text>Fecha y Hora: {reportData.fecha} - {reportData.hora}</Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Personal Asignado</Text>
      <Text>Técnico: {reportData.tecnico}</Text>
      <Text>Ayudante: {reportData.ayudante}</Text>
      <Text>Motorista: {reportData.motorista}</Text>
      <Text>Supervisor: {reportData.supervisor}</Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Checklist de Trabajo</Text>
      {checklist.map((item) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <Checkbox status={item.completado ? 'checked' : 'unchecked'} onPress={() => {}} />
          <Text>{item.descripcion}</Text>
        </View>
      ))}

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Formulario del Sistema</Text>
      {sistemaForm.map((campo) => (
        <View key={campo.id} style={{ marginBottom: 15 }}>
          <Text>{campo.campo}</Text>
          <TextInput style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }}
            placeholder={`Ingrese ${campo.campo.toLowerCase()}...`}
            multiline
            value={campo.valor}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default Abordaje;
