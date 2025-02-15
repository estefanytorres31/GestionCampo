import apiClient from "../API/apiClient";

export const createAbordaje=async(id_orden_trabajo_usuario, motorista, supervisor,  id_puerto)=>{
    try{
        const response=await apiClient.post(`/abordaje`, {
        id_orden_trabajo_usuario,
        motorista,
        supervisor,
        id_puerto
    })
    return response.data;
    }catch(e){
        console.error(e);
        throw new Error("Error al crear abordaje");
    }
}

export const getAllAbordajes=async()=>{
    try{
        const response=await apiClient.get(`/abordaje`);
        return response.data;
    }catch(e){
        console.error(e);
        throw new Error("Error al obtener abordajes");
    }
}


export const getAbordajeByOrdenTrabajo=async(id)=>{
    try{
        const response=await apiClient.get(`/abordaje/orden-trabajo/${id}`);
        return response.data;
    }catch(e){
        console.error(e);
        throw new Error("Error al obtener abordajes por orden de trabajo");
    }
}

export const getAbordajeById=async(id)=>{
    try{
        const response=await apiClient.get(`/abordaje/${id}`);
        return response.data;
    }catch(e){
        console.error(e);
        throw new Error("Error al obtener abordajes por orden de trabajo");
    }
}