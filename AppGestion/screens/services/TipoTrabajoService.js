import apiClient from "../API/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.warn('Token no encontrado');
        }
        return token;
    } catch (error) {
        console.error('Error obteniendo el token:', error);
        throw error;
    }
};


export const getAllTipoTrabajo = async () => {
    try {
        const token = await getToken();
        const response = await apiClient.get('/tipotrabajo', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo los tipos de trabajo:', error);
        throw error;
    }
}