import React,{useState} from "react";
import OrdenTrabajoParteContext from "./OrdenTrabajoParteContext"
import  {createOrdenTrabajoParte} from "../../services/OrdenTrabajoParteService"

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
    return(
        <OrdenTrabajoParteContext.Provider value={{
            ordenTrabajoPartes,
            loading,
            error,
            agregarOrdenTrabajoParte
        }}>
            {children}
        </OrdenTrabajoParteContext.Provider>
    )
}

export default OrdenTrabajoParteProvider;