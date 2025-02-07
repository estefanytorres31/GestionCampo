import apiClient from "../API/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createAsistencia = async (id_embarcacion, tipo, latitud, longitud, id_orden_trabajo) => {
    const userId = await AsyncStorage.getItem('userId');
    const userIdInt = parseInt(userId, 10);
    
    
    // Asegurarse de que id_embarcacion sea número
    const embarcacionId = parseInt(id_embarcacion, 10);
    
    // Convertir coordenadas a string con precisión fija
    const lat = parseFloat(latitud).toFixed(6);
    const lng = parseFloat(longitud).toFixed(6);

    // Construir el payload con las conversiones necesarias
    const payload = {
        id_usuario: userIdInt,
        id_embarcacion: embarcacionId,
        tipo: tipo,
        latitud: lat,
        longitud: lng,
        id_orden_trabajo: id_orden_trabajo || null // Asegurarse de que sea null si no se proporciona
    };

    console.log('Payload being sent:', payload); // Para debugging

    try {
        const response = await apiClient.post('/asistencia', payload);
        console.log('Response received:', response.data); // Para debugging
        return response.data;
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error al crear la asistencia');
    }
};

export const getUltimoAsistenciaByUser = async () => {
    try {
        const userId = await AsyncStorage.getItem("userId");
        const userIdInt = parseInt(userId, 10);

        const response = await apiClient.get(`/asistencia/usuario/${userIdInt}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error.response?.data || error.message);
        return [];
    }
};