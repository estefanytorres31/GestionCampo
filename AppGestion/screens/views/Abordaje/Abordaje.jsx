import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useAbordaje from '../../hooks/Abordaje/useAbordaje';

const formatPERDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm", { locale: es });
};

const SectionTitle = ({ children }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const DetailItem = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || 'No especificado'}</Text>
  </View>
);

const Abordaje = ({ route }) => {
  const { idAbordaje } = route.params;
  const { obtenerAbordajePorId } = useAbordaje();
  const [abordaje, setAbordaje] = useState(null);
  
  useEffect(() => {
    const fetchAbordaje = async () => {
      try {
        const data = await obtenerAbordajePorId(idAbordaje);
        setAbordaje(data);
      } catch (error) {
        console.error("Error al obtener los detalles del abordaje:", error);
      }
    };
    
    fetchAbordaje();
  }, [idAbordaje, obtenerAbordajePorId]);

  if (!abordaje) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando detalles del abordaje...</Text>
      </View>
    );
  }

  const { ordenTrabajoUsuario, ordenTrabajoSistemaDetalle, ordenTrabajoSistemaFoto, ordenTrabajoPartes } = abordaje;
  const { orden_trabajo } = ordenTrabajoUsuario;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Información General */}
        <View style={styles.card}>
          <SectionTitle>Información General</SectionTitle>
          <DetailItem 
            label="Código OT" 
            value={orden_trabajo.codigo}
          />
          <DetailItem 
            label="Fecha de Abordaje" 
            value={abordaje.fecha}
          />
          <DetailItem 
            label="Motorista" 
            value={abordaje.motorista}
          />
          <DetailItem 
            label="Supervisor" 
            value={abordaje.supervisor}
          />
          <DetailItem 
            label="Estado OT" 
            value={orden_trabajo.estado}
          />
        </View>

        {/* Detalles del Sistema */}
        <View style={styles.card}>
          <SectionTitle>Detalles del Sistema</SectionTitle>
          {ordenTrabajoSistemaDetalle.map((detalle, index) => (
            <View key={index}>
              <DetailItem 
                label="Observaciones" 
                value={detalle.observaciones}
              />
              <DetailItem 
                label="Avance" 
                value={`${detalle.avance}%`}
              />
              <DetailItem 
                label="Materiales" 
                value={detalle.materiales}
              />
              <DetailItem 
                label="Próximo Abordaje" 
                value={detalle.proximo_abordaje}
              />
            </View>
          ))}
        </View>

        {/* Fotos */}
        {ordenTrabajoSistemaFoto.length > 0 && (
          <View style={styles.card}>
            <SectionTitle>Fotos</SectionTitle>
            <ScrollView horizontal={true} style={styles.photoScroll}>
              {ordenTrabajoSistemaFoto.map((foto, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image
                    source={{ uri: foto.url }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  <Text style={styles.photoDate}>
                    {formatPERDate(foto.creado_en)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Partes de Trabajo */}
        <View style={styles.card}>
          <SectionTitle>Partes de Trabajo</SectionTitle>
          {ordenTrabajoPartes.map((parte, index) => (
            <View key={index} style={styles.parteItem}>
              <DetailItem 
                label="Estado" 
                value={parte.estado}
              />
              <DetailItem 
                label="Fecha de Creación" 
                value={formatPERDate(parte.creado_en)}
              />
              <DetailItem 
                label="Última Actualización" 
                value={formatPERDate(parte.actualizado_en)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  photoScroll: {
    flexGrow: 0,
    height: 200,
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 180,
    height: 160,
    borderRadius: 8,
  },
  photoDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  parteItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Abordaje;