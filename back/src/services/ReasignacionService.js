import apiClient from "../API/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createReasignacion = async (codigo_ot, id_tecnico, id_motorista, id_supervisor, ayudantes) => {
    const userId = await AsyncStorage.getItem('userId');
    const userIdInt = parseInt(userId, 10);
    
    try {
        const response = await apiClient.post(`/reasignaciones`, {
            codigo_ot,
            id_tecnico,
            id_motorista,
            id_supervisor,
            id_jefe_asigna: userIdInt, // Quien asigna la reasignación
            ayudantes, // Enviar lista de ayudantes si existen
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al crear la reasignación: ${error.message}`);
    }
};

export const getReasignacionById = async (id_reasignacion) => {
    try {
        const response = await apiClient.get(`/reasignaciones/${id_reasignacion}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener la reasignación: ${error.message}`);
    }
};

export const getAllReasignacionesByJefe = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const userIdInt = parseInt(userId, 10);
        const response = await apiClient.get(`/reasignaciones?id_jefe_asigna=${userIdInt}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener las reasignaciones: ${error.message}`);
    }
};

export const updateReasignacion = async (id_reasignacion, estado) => {
    try {
        const response = await apiClient.put(`/reasignaciones/${id_reasignacion}`, { estado });
        return response.data;
    } catch (error) {
        throw new Error(`Error al actualizar la reasignación: ${error.message}`);
    }
};

export const deleteReasignacion = async (id_reasignacion) => {
    try {
        const response = await apiClient.delete(`/reasignaciones/${id_reasignacion}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al eliminar la reasignación: ${error.message}`);
    }
};
