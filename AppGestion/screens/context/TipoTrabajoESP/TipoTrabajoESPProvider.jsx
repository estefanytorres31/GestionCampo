import { useState, useEffect } from "react";
import { getAllTipoTrabajoESP, getAllTipoTrabajoWithPartsESP, getPartsBySistema } from "../../services/TipoTrabajoESPService";
import TipoTrabajoESPContext from "./TipoTrabajoESPContext";


const TipoTrabajoESPProvider=({children})=>{
    const [tipoTrabajosESP, setTipoTrabajosESP] = useState([]);
    const [parts, setParts]=useState([]);
    
    // Obtener todos los sistemas de un tipo de trabajo segun la embarcacion
    const fetchTiposTrabajosESP=async(id_tipo_trabajo, id_embarcacion)=>{
        try {
            const response=await getAllTipoTrabajoESP(id_tipo_trabajo, id_embarcacion);
            setTipoTrabajosESP(response.data);
        } catch (error) {
            console.error("Error fetching tipo trabajos ESP: ", error);
        }
    }

    const fetchTiposTrabajosWithPartsESP = async(id_tipo_trabajo, id_embarcacion) => {
        try {
            const response = await getAllTipoTrabajoWithPartsESP(id_tipo_trabajo, id_embarcacion);;
            setTipoTrabajosESP(response.data);
            return response;
        } catch (error) {
            console.error("Error fetching tipo trabajos ESP: ", error);
            throw error; // Re-lanzamos el error para manejarlo en el componente
        }
    }

    // Obtener las partes de un sistema de un tipo de trabajo segun la embarcacion
    const fetchPartsBySistema = async(id_tipo_trabajo, id_embarcacion, id_sistema) => {
        try {
            const response = await getPartsBySistema(id_tipo_trabajo, id_embarcacion, id_sistema);
            setParts(response.data);
            return response;
        } catch (error) {
            console.error("Error fetching parts by sistema: ", error);
            throw error; // Re-lanzamos el error para manejarlo en el componente
        }
    }

    const value={
        tipoTrabajosESP,
        fetchTiposTrabajosESP,
        fetchPartsBySistema,
        fetchTiposTrabajosWithPartsESP,
        parts
    }
    
    return(
        <TipoTrabajoESPContext.Provider value={value}>
        {children}
        </TipoTrabajoESPContext.Provider>
    )
}

export default TipoTrabajoESPProvider;