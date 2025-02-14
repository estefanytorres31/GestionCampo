import React,{useState} from "react";
import OrdenTrabajoParteContext from "./OrdenTrabajoParteContext"
import  {createOrdenTrabajoParte, updateOrdenTrabajoParte} from "../../services/OrdenTrabajoParteService"

const OrdenTrabajoParteProvider = ({children}) => {
    const [ordenTrabajoPartes, setOrdenTrabajoPartes] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const agregarOrdenTrabajoParte = async (id_orden_trabajo_sistema, id_parte) => {
        setLoading(true)
        setError(null)
        try{
            const response = await createOrdenTrabajoParte(id_orden_trabajo_sistema, id_parte)
            return response.data;            
        }catch(err){
            setError(err.message)
        }
    }
    
    const actualizarOrdenTrabajoParte = async (id_orden_trabajo_parte, estado, comentario, id_abordaje) => {
        setLoading(true)
        setError(null)
        try{
            await updateOrdenTrabajoParte(id_orden_trabajo_parte, estado, comentario, id_abordaje)
            setLoading(false)
        }catch(err){
            setError(err.message)
            setLoading(false)
        }
    }


    return(
        <OrdenTrabajoParteContext.Provider value={{
            ordenTrabajoPartes,
            loading,
            error,
            actualizarOrdenTrabajoParte,
            agregarOrdenTrabajoParte
        }}>
            {children}
        </OrdenTrabajoParteContext.Provider>
    )
}

export default OrdenTrabajoParteProvider;