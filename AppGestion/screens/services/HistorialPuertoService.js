import apiClient from "../API/apiClient";

export const createHistorial=async (embarcacion_id, puerto_id) => {
    try{
        const response = await apiClient.post(`/historialpuerto`, { embarcacion_id, puerto_id });
        return response.data;
    }catch(e){
        console.error('Error creando historial de puerto:', e);
        throw e;
    }
}