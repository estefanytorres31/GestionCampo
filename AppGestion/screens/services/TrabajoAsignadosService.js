import apiClient from "../API/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Obtener órdenes de trabajo asignadas a un usuario con el rol "Responsable"
export const getOrdenesTrabajoUsuario = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const userIdInt = parseInt(userId, 10);

        const response = await apiClient.get(`/ordenestrabajousuario?rol_en_orden=Responsable&id_usuario=${userIdInt}`);
        const ordenesTrabajoUsuario = response.data.data; // Se accede a "data" correctamente

        // Extraer los id_orden_trabajo de la respuesta
        const ordenesTrabajoIds = ordenesTrabajoUsuario.map(orden => orden.id_orden_trabajo);

        return ordenesTrabajoIds;
    } catch (error) {
        console.error('Error obteniendo órdenes de trabajo del usuario:', error);
        throw error;
    }
};

// Obtener la información de una orden de trabajo por ID
export const getOrdenTrabajo = async (idOrden) => {
    try {
        const response = await apiClient.get(`/ordenestrabajo/${idOrden}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error obteniendo orden de trabajo con ID ${idOrden}:`, error);
        throw error;
    }
};

// Obtener la información del tipo de trabajo por ID
export const getTipoTrabajo = async (idTipoTrabajo) => {
    try {
        const response = await apiClient.get(`/tipo_trabajo/${idTipoTrabajo}`);
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo tipo de trabajo con ID ${idTipoTrabajo}:`, error);
        throw error;
    }
};

// Función para obtener todas las órdenes de trabajo y sus tipos (filtrando por estado)
export const getTrabajosAsignados = async () => {
    try {
        // Obtener las órdenes de trabajo asignadas al usuario
        const ordenesTrabajoIds = await getOrdenesTrabajoUsuario();

        // Obtener detalles de cada orden de trabajo
        const ordenesTrabajoPromises = ordenesTrabajoIds.map(id => getOrdenTrabajo(id));
        let ordenesTrabajo = await Promise.all(ordenesTrabajoPromises);

        // 🔥 **Filtrar órdenes que no sean "completado", "cancelado" o "inactivo"**
        ordenesTrabajo = ordenesTrabajo.filter(orden => 
            orden.estado !== "completado" && 
            orden.estado !== "cancelado" && 
            orden.estado !== "inactivo"
        );

        // Obtener los tipos de trabajo
        const tipoTrabajoPromises = ordenesTrabajo.map(orden => getTipoTrabajo(orden.id_tipo_trabajo));
        const tiposTrabajo = await Promise.all(tipoTrabajoPromises);

        // Combinar la información en una lista
        const trabajosAsignados = ordenesTrabajo.map((orden, index) => ({
            id_orden_trabajo: orden.id_orden_trabajo,
            nombre_trabajo: tiposTrabajo[index].nombre_trabajo,
            estado: orden.estado,
        }));

        return trabajosAsignados;
    } catch (error) {
        console.error('Error obteniendo trabajos asignados:', error);
        throw error;
    }
};
