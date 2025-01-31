import { useState, useEffect } from "react";
import { getAllTipoTrabajoESP, getAllTipoTrabajoWithPartsESP } from "../../services/TipoTrabajoESPService";
import TipoTrabajoESPContext from "./TipoTrabajoESPContext";


const TipoTrabajoESPProvider=({children})=>{
    const [tipoTrabajosESP, setTipoTrabajosESP] = useState([]);
    
    // Obtener todos los sistemas de un tipo de trabajo segun la embarcacion
    const fetchTiposTrabajosESP=async(id_tipo_trabajo, id_embarcacion)=>{
        try {
            const response=await getAllTipoTrabajoESP(id_tipo_trabajo, id_embarcacion);
            setTipoTrabajosESP(response.data);
        } catch (error) {
            console.error("Error fetching tipo trabajos ESP: ", error);
        }
    }

    const fetchTiposTrabajosWithPartsESP=async(id_tipo_trabajo, id_embarcacion)=>{
        try {
            const response=await getAllTipoTrabajoWithPartsESP(id_tipo_trabajo, id_embarcacion);
            setTipoTrabajosESP(response.data);
        } catch (error) {
            console.error("Error fetching tipo trabajos ESP: ", error);
        }
    }

    const value={
        tipoTrabajosESP,
        fetchTiposTrabajosESP,
        fetchTiposTrabajosWithPartsESP
    }
    
    return(
        <TipoTrabajoESPContext.Provider value={value}>
        {children}
        </TipoTrabajoESPContext.Provider>
    )
}

export default TipoTrabajoESPProvider;