import apiClient from "../API/apiClient";

export const createOrdenTrabajoSistema=async(id_orden_trabajo, id_tipo_trabajo_embarcacion_sistema_parte)=>{
    try {
        const response = await apiClient.post(`/ordenestrabajosistema`, {
            id_orden_trabajo,
            id_tipo_trabajo_embarcacion_sistema_parte
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al crear la orden de trabajo sistema: ${error.message}`);
    }
 
}