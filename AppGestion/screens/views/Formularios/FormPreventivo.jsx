import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Camera, Image as ImageIcon, Plus, Save, Percent } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { CommonActions } from '@react-navigation/native';
import useOrdenTrabajoSistema from "../../hooks/OrdenTrabajoSistema/useOrdenTrabajoSistema";
import useAuth from "../../hooks/Auth/useAuth";

const MaintenanceForm = ({route, navigation}) => {
  const {id_orden_trabajo_sistema}=route.params;
  const {role}=useAuth();
  const [formData, setFormData] = useState({
    material: '',
    observations: '',
    nextVisitItems: '',
    progress: 0,
    images: []
  });

  const [showProgress, setShowProgress] = useState(false);
  const {actualizarOrdenTrabajoSistemaCompleta}=useOrdenTrabajoSistema();

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Se requiere permiso para usar la cámara');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Se requiere permiso para acceder a la galería');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaType,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Form validation remains the same
    if (!formData.material.trim()) {
        Alert.alert('Error', 'Por favor ingrese el material');
        return;
    }
    
    if (!formData.observations.trim()) {
        Alert.alert('Error', 'Por favor ingrese las observaciones');
        return;
    }
    
    if (!formData.nextVisitItems.trim()) {
        Alert.alert('Error', 'Por favor ingrese los materiales para la próxima visita');
        return;
    }

    try {
        const formDataToSend = new FormData();
        
        // Add text fields
        formDataToSend.append('materiales', formData.material);
        formDataToSend.append('observaciones', formData.observations);
        formDataToSend.append('proximo_abordaje', formData.nextVisitItems);
        formDataToSend.append('avance', Math.round(formData.progress).toString());

        // Add images
        for (let i = 0; i < formData.images.length; i++) {
            const uri = formData.images[i];
            const fileName = uri.split('/').pop();
            
            // Create blob of the image
            const imageFile = {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                type: 'image/jpeg',
                name: fileName || `image${i}.jpg`,
            };
            
            formDataToSend.append('imagenes', imageFile);
        }

        console.log('Sending FormData:', formDataToSend);
        
        const result = await actualizarOrdenTrabajoSistemaCompleta(
            id_orden_trabajo_sistema,
            formDataToSend
        );

        console.log('Response:', result);

        Alert.alert(
            'Éxito',
            'Los datos se han guardado correctamente',
            [{ text: 'OK', onPress: () => 
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: role.includes("Jefe") ? "InicioJefe" : "Inicio" },
                  ],
                })
              ),
          }]
        );

    } catch (error) {
        console.error('Error saving form:', error);
        Alert.alert(
            'Error',
            'No se pudieron guardar los datos. Por favor intente nuevamente.'
        );
    }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material</Text>
          <TextInput
            style={styles.input}
            value={formData.material}
            onChangeText={(text) => setFormData(prev => ({ ...prev, material: text }))}
            placeholder="Ingrese el material utilizado"
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones / Recomendaciones</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.observations}
            onChangeText={(text) => setFormData(prev => ({ ...prev, observations: text }))}
            placeholder="Ingrese observaciones o recomendaciones"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Llevar próxima vez</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.nextVisitItems}
            onChangeText={(text) => setFormData(prev => ({ ...prev, nextVisitItems: text }))}
            placeholder="¿Qué materiales se necesitarán en la próxima visita?"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imágenes</Text>
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity 
              style={styles.imageButton}
              onPress={() => pickImage(true)}
            >
              <Camera size={24} color="#ffffff" />
              <Text style={styles.imageButtonText}>Tomar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.imageButton}
              onPress={() => pickImage(false)}
            >
              <ImageIcon size={24} color="#ffffff" />
              <Text style={styles.imageButtonText}>Galería</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            style={styles.imagesScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {formData.images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Porcentaje de avance</Text>
            <Text style={styles.progressText}>{`${Math.round(formData.progress)}%`}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={formData.progress}
            onValueChange={(value) => setFormData(prev => ({ ...prev, progress: value }))}
            minimumTrackTintColor="#6366f1"
            maximumTrackTintColor="#e2e8f0"
            thumbTintColor="#6366f1"
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Save size={24} color="#ffffff" />
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#334155',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  imageButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagesScrollView: {
    flexGrow: 0,
    marginBottom: 8,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
  },
  slider: {
    height: 40,
  },
  saveButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default MaintenanceForm;