import React,{useState, useEffect} from "react";
import AbordajeContext from "./AbordajeContext";
import { createAbordaje, getAllAbordajes,  getAbordajeByOrdenTrabajo, getAbordajeById } from "../../services/AbordajeService";

const AbordajeProvider = ({ children }) => {
    const [abordajes, setAbordajes] = useState([]);
    const [abordaje, setAbordaje] = useState(null);

    const crearAbordaje=async(id_orden_trabajo_usuario, motorista, supervisor,  id_puerto)=>{
        try {
            const response = await createAbordaje(id_orden_trabajo_usuario, motorista, supervisor,  id_puerto);
            setAbordajes([...abordajes, response.data]);
            setAbordaje(null);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    
    const obtenerTodosLosAbordajes=async()=>{
        try {
            const response = await getAllAbordajes();
            setAbordajes(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        obtenerTodosLosAbordajes();
    },[]);

    const obtenerAbordajePorOrdenTrabajo=async(id)=>{
        try {
            const response = await getAbordajeByOrdenTrabajo(id);
            setAbordaje(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const obtenerAbordajePorId=async(id)=>{
        try {
            const response = await getAbordajeById(id);
            setAbordaje(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AbordajeContext.Provider value={{
            abordajes,
            setAbordajes,
            abordaje,
            setAbordaje,
            crearAbordaje,
            obtenerAbordajePorOrdenTrabajo,
            obtenerAbordajePorId
        }}>
            {children}
        </AbordajeContext.Provider>
    );
}

export default AbordajeProvider;