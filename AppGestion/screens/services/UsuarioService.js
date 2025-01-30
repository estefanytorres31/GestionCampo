import apiClient from "../API/apiClient";

export const getUserById = async (id) => {
    console.log('Fetching user with ID:', id);

    try {
        const response = await apiClient.get(`/usuario/${id}`);
        
        if (!response.data) {
            console.warn(`No user data found for ID: ${id}`);
            throw new Error('User not found');
        }
        
        return response.data;
    } catch (error) {
        if (error.message === 'User not found') {
            throw error;
        }
        console.error('Error fetching user:', error);
        throw new Error('Error retrieving user data');
    }
};

export const getAllUsuariosByRol = async (rolId) => {
    try {
        const response = await apiClient.get(`/usuariorol/rol/${rolId}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo usuarios por rol:', error);
        throw error;
    }
};