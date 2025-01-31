import apiClient from "../API/apiClient";

// Obtener todos los sistemas de un tipo de trabajo segun la embarcacion
export const getAllTipoTrabajoESP=async(id_tipo_trabajo, id_embarcacion)=>{
    try {
        const response = await apiClient.get(`/tipotrabajoesp/tipo/${id_tipo_trabajo}/embarcacion/${id_embarcacion}/sistemas`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener los tipo de trabajo especializados: ${error.message}`);
    }
}