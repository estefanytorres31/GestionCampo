import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useAbordaje from '../../hooks/Abordaje/useAbordaje';

const { width } = Dimensions.get('window');

const formatPERDate = (dateString) => {
  const date = new Date(dateString);
  const peruDate = new Date(date.getTime() - (5 * 60 * 60 * 1000));
  return format(peruDate, "dd/MM/yyyy HH:mm", { locale: es });
};

const SectionTitle = ({ children }) => (
  <View style={styles.sectionTitleContainer}>
    <View style={styles.sectionTitleContent}>
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
    <View style={styles.sectionTitleUnderline} />
  </View>
);

const DetailItem = ({ label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'No especificado'}</Text>
    </View>
  </View>
);

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'en_progreso':
        return {
          text: 'En Progreso',
          style: styles.statusInProgress,
          textStyle: styles.statusInProgressText
        };
      case 'completado':
        return {
          text: 'Completado',
          style: styles.statusCompleted,
          textStyle: styles.statusCompletedText
        };
      default:
        return {
          text: 'Pendiente',
          style: styles.statusPending,
          textStyle: styles.statusPendingText
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.statusBadge, config.style]}>
      <Text style={[styles.statusText, config.textStyle]}>{config.text}</Text>
    </View>
  );
};

const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBarBackground}>
      <View 
        style={[
          styles.progressBarFill, 
          { width: `${progress}%` },
          progress >= 100 && styles.progressBarComplete
        ]} 
      />
    </View>
    <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
  </View>
);

const PhotoGallery = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <View>
      <ScrollView 
        horizontal={true} 
        style={styles.photoScroll}
        showsHorizontalScrollIndicator={false}
      >
        {photos.map((foto, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.photoContainer}
            onPress={() => setSelectedPhoto(foto)}
          >
            <Image
              source={{ uri: foto.url }}
              style={styles.photo}
              resizeMode="cover"
            />
            <View style={styles.photoOverlay}>
              <Text style={styles.photoDate}>
                {formatPERDate(foto.creado_en)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedPhoto && (
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setSelectedPhoto(null)}
        >
          <Image
            source={{ uri: selectedPhoto.url }}
            style={styles.modalPhoto}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Abordaje = ({ route }) => {
  const { idAbordaje } = route.params;
  const { obtenerAbordajePorId } = useAbordaje();
  const [abordaje, setAbordaje] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchAbordaje();
  }, [idAbordaje, obtenerAbordajePorId]);

  const fetchAbordaje = async () => {
    try {
      setRefreshing(true);
      const data = await obtenerAbordajePorId(idAbordaje);
      setAbordaje(data);
    } catch (error) {
      console.error("Error al obtener los detalles del abordaje:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!abordaje) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando detalles del abordaje...</Text>
      </View>
    );
  }

  const { ordenTrabajoUsuario, ordenTrabajoSistemaDetalle, ordenTrabajoSistemaFoto, ordenTrabajoPartes } = abordaje;
  const { orden_trabajo } = ordenTrabajoUsuario;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Orden de Trabajo</Text>
            <Text style={styles.headerCode}>{orden_trabajo.codigo}</Text>
          </View>
          <StatusBadge status={orden_trabajo.estado} />
        </View>

        {/* Información General */}
        <View style={styles.card}>
          <SectionTitle>Información General</SectionTitle>
          <View style={styles.cardContent}>
            <DetailItem 
              label="Fecha de Abordaje" 
              value={formatPERDate(abordaje.fecha)}
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
              label="Técnico" 
              value={abordaje.id_tecnico}
            />
            <DetailItem 
              label="Ayudante" 
              value={abordaje.id_ayudante}
            />
          </View>
        </View>

        {/* Detalles del Sistema */}
        <View style={styles.card}>
          <SectionTitle>Detalles del Sistema</SectionTitle>
          {ordenTrabajoSistemaDetalle.map((detalle, index) => (
            <View key={index} style={styles.systemDetailCard}>
              <View style={styles.cardContent}>
                <View style={styles.observationContainer}>
                  <Text style={styles.observationTitle}>Observaciones</Text>
                  <Text style={styles.observationText}>{detalle.observaciones}</Text>
                </View>
                
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Avance del Trabajo</Text>
                    <ProgressBar progress={detalle.avance} />
                  </View>
                </View>

                <View style={styles.materialsSection}>
                  <Text style={styles.materialsTitle}>Materiales Utilizados</Text>
                  <View style={styles.materialsContent}>
                    <Text style={styles.materialsText}>{detalle.materiales}</Text>
                  </View>
                </View>

                <View style={styles.nextBoardingSection}>
                  <Text style={styles.nextBoardingTitle}>Próximo Abordaje</Text>
                  <View style={styles.nextBoardingContent}>
                    <Text style={styles.nextBoardingText}>{detalle.proximo_abordaje}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Galería de Fotos */}
        {ordenTrabajoSistemaFoto.length > 0 && (
          <View style={styles.card}>
            <SectionTitle>Galería de Fotos</SectionTitle>
            <PhotoGallery photos={ordenTrabajoSistemaFoto} />
          </View>
        )}

        {/* Partes de Trabajo */}
        <View style={styles.card}>
          <SectionTitle>Partes de Trabajo</SectionTitle>
          {ordenTrabajoPartes.map((parte, index) => (
            <View key={index} style={styles.workPartCard}>
              <StatusBadge status={parte.estado} />
              <View style={styles.workPartContent}>
                <DetailItem 
                  label="Creado" 
                  value={formatPERDate(parte.creado_en)}
                />
                <DetailItem 
                  label="Actualizado" 
                  value={formatPERDate(parte.actualizado_en)}
                />
              </View>
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
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  headerCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  sectionTitleContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sectionTitleUnderline: {
    height: 2,
    backgroundColor: '#2196F3',
    width: 40,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  detailContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusInProgress: {
    backgroundColor: '#E3F2FD',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusInProgressText: {
    color: '#1976D2',
  },
  statusCompletedText: {
    color: '#388E3C',
  },
  statusPendingText: {
    color: '#F57C00',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F0F2F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  progressBarComplete: {
    backgroundColor: '#4CAF50',
  },
  progressText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'right',
  },
  systemDetailCard: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    elevation: 2,
  },
  observationContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  observationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  observationText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  progressSection: {
    marginVertical: 16,
  },
  progressHeader: {
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  materialsSection: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  materialsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  materialsContent: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
  },
  materialsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  photoScroll: {
    padding: 16,
  },
  photoContainer: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: width * 0.7,
    height: width * 0.5,
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  photoDate: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalPhoto: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 12,
  },
  workPartCard: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
  },
  workPartContent: {
    marginTop: 12,
  },
  nextBoardingSection: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  nextBoardingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  nextBoardingContent: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
  },
  nextBoardingText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
});

export default Abordaje;