import apiClient from "../API/apiClient"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createOrdenTrabajo=async(id_tipo_trabajo, id_embarcacion, codigo)=>{
    const userId = await AsyncStorage.getItem('userId');
    const userIdInt = parseInt(userId, 10);
    try {
        const response = await apiClient.post(`/ordenestrabajo`, {
            id_tipo_trabajo,
            id_embarcacion,
            id_jefe_asigna:userIdInt,
            codigo,
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al crear la orden de trabajo: ${error.message}`);
    }
}

export const getOrdenTrabajoById=async(id_orden_trabajo)=>{
    try {
        const response = await apiClient.get(`/ordenestrabajo/${id_orden_trabajo}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener la orden de trabajo: ${error.message}`);
    }
}

export const getAllTrabajosByJefeAsig=async()=>{
    try {
        const userId = await AsyncStorage.getItem('userId');
        const userIdInt = parseInt(userId, 10);
        const response = await apiClient.get(`/ordenestrabajo?estados=en_progreso,pendiente`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener las ordenes de trabajo: ${error.message}`);
    }
}

export const getAllTrabajosByEmbarcacion=async(id_embarcacion)=>{
    try {
        const response = await apiClient.get(`/ordenestrabajo?id_embarcacion=${id_embarcacion}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener las ordenes de trabajo: ${error.message}`);
    }
}

export const updateOrdenTrabajo=async(id_orden_trabajo, estado)=>{
    try {
        const response = await apiClient.put(`/ordenestrabajo/${id_orden_trabajo}`, {estado});
        console.log(id_orden_trabajo,'Estado',estado)
        return response.data;
    } catch (error) {
        throw new Error(`Error al actualizar la orden de trabajo: ${error.message}`);
    }

}

export const updateAllOrdenTrabajo=async(id_orden_trabajo, id_puerto, motorista, supervisor)=>{
    try {
        const response = await apiClient.put(`/ordenestrabajo/${id_orden_trabajo}`, {id_puerto, motorista, supervisor});
        console.log(id_orden_trabajo,'Puerto',id_puerto,'Motorista',motorista,'Supervisor',supervisor)
        return response.data;
    } catch (error) {
        throw new Error(`Error al actualizar la orden de trabajo: ${error.message}`);
    }
    
}