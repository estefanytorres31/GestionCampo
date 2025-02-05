import apiClient from "../API/apiClient";

export const createOrdenTrabajoParte=async(id_orden_trabajo_sistema, id_parte) =>{
    try {
        const response = await apiClient.post("/ordenestrabajoparte", {
            id_orden_trabajo_sistema,
            id_parte
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}