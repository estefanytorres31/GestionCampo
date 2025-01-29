import apiClient from "../API/apiClient"
import AsyncStorage from '@react-native-async-storage/async-storage';

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


export const getAllEmpresas = async () => {
    try {
        const token = await getToken();
        const response = await apiClient.get('/empresa', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo las empresas:', error);
        throw error;
    }
}