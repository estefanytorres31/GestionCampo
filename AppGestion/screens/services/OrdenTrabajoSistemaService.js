import apiClient from "../API/apiClient";

export const createOrdenTrabajoSistema=async(id_orden_trabajo, id_embarcacion_sistema)=>{
    try {
        const response = await apiClient.post(`/ordenestrabajosistema`, {
            id_orden_trabajo,
            id_embarcacion_sistema
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al crear la orden de trabajo sistema: ${error.message}`);
    }
 
}

export const getOrdenTrabajoSistemaByOrdenTrabajo=async(id_orden_trabajo)=>{
    try {
        const response = await apiClient.get(`/ordenestrabajosistema/${id_orden_trabajo}/sistemas-partes`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener la orden de trabajo sistema por id de orden de trabajo: ${error.message}`);
    }
 
}

export const updateEstadoOrdenTrabajoSistema=async(id_orden_trabajo_sistema,estado)=>{
    try {
        const response = await apiClient.put(`/ordenestrabajosistema/${id_orden_trabajo_sistema}/estado`, {estado});
        return response.data;
    } catch (error) {
        throw new Error(`Error al actualizar el estado de la orden de trabajo sistema: ${error.message}`);
    }
}

export const updateOrdenTrabajoSistema = async(id_orden_trabajo_sistema, data)=>{
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        // Pass data directly, not wrapped in an object
        const response = await apiClient.put(
            `/ordenestrabajosistema/${id_orden_trabajo_sistema}`, 
            data,
            config
        );
        console.log('Back:', response.data);
        return response.data;
    } catch (error) {
        throw new Error(`Error al actualizar la orden de trabajo sistema: ${error.message}`);
    }
}