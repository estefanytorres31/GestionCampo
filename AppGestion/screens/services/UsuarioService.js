import apiClient from "../API/AxiosConfig";

export const getUserById=async(id)=>{
    try{
        const response=await apiClient.get(`/usuario/${id}`)
        return response.data
    }catch(error){
        console.error(error);
        return null;
    }
}