import apiClient from "../API/apiClient";
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

export const login = async (usuario, contrasena) => {
    if (!usuario || !contrasena) {
        console.error('Usuario y contraseña son requeridos');
        return null;
    }
    try {
        const response = await apiClient.post('/auth/login', { usuario, contrasena });
        const { data, status } = response;
        return { data, status };
    } catch (error) {
        if (error.response) {
            console.error('Error en el servidor:', error.response.data);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error durante el login:', error.message);
        }
        return null;
    }
};



export const logout = async () => {
    try {
        const token = await getToken();
        if (!token) {
            console.warn('No se encontró token para cerrar sesión');
            return null;
        }
        const response = await apiClient.post('/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        console.error('Error al cerrar sesión:', error.response?.data || error.message);
        throw error;
    }
};

