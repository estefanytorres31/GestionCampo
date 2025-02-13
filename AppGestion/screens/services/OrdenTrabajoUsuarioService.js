import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const getOrdenTrabajoUsuarioByUserId=async()=>{
    const userId = await AsyncStorage.getItem('userId');
    const userIdInt = parseInt(userId, 10);
    try{
        const response = await apiClient.get(`/ordenestrabajousuario?id_usuario=${userIdInt}`);
        return response.data;
    }catch(error){
        console.error('Error obteniendo la orden de trabajo del usuario:', error);
        throw error;
    }
}

export const getOrdenTrabajoUsuarioByOT=async(id_orden_trabajo)=>{
    try{
        const response = await apiClient.get(`/ordenestrabajousuario?id_orden_trabajo=${id_orden_trabajo}`);
        return response.data;
    }catch(error){
        console.error('Error obteniendo la orden de trabajo por id:', error);
        throw error;
    }
}

export const asignarOT=async(id_orden_trabajo, nuevos_usuarios)=>{
    try{
        const response = await apiClient.post(`/ordenestrabajousuario/reasignar`,{
            id_orden_trabajo,
            nuevos_usuarios
        });
        return response.data;
    }catch(error){
        console.error('Error reasignando la orden de trabajo:', error);
        throw error;
    }
}