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