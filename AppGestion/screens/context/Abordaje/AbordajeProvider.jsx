import React,{useState, useEffect} from "react";
import AbordajeContext from "./AbordajeContext";
import { createAbordaje, getAllAbordajes } from "../../services/AbordajeService";

const AbordajeProvider = ({ children }) => {
    const [abordajes, setAbordajes] = useState([]);
    const [abordaje, setAbordaje] = useState(null);

    const crearAbordaje=async(id_orden_trabajo_usuario, fecha, motorista, supervisor,  id_puerto)=>{
        try {
            const response = await createAbordaje(id_orden_trabajo_usuario, fecha, motorista, supervisor,  id_puerto);
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

    return (
        <AbordajeContext.Provider value={{
            abordajes,
            setAbordajes,
            abordaje,
            setAbordaje,
            crearAbordaje
        }}>
            {children}
        </AbordajeContext.Provider>
    );
}

export default AbordajeProvider;