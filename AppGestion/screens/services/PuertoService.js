import apiClient from "../API/apiClient";

export const getAllPuertos = async () => {
    try {
        const response = await apiClient.get('/puerto');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo los puertos:', error);
        throw error;
    }
};
