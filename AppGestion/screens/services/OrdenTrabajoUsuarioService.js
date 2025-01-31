import apiClient from "../API/apiClient";

export const createOrdenTrabajoUsuario=async(id_orden_trabajo, id_usuario, rol_en_orden)=>{
    try {
        const response = await apiClient.post('/ordenestrabajousuario',{
            id_orden_trabajo,
            id_usuario,
            rol_en_orden
        });
        return response.data;
    } catch (error) {
        console.error('Error creando la orden de trabajo:', error);
        throw error;
    }
}