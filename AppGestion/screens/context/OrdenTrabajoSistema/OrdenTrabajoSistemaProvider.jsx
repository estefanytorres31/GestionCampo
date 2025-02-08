import React, {useState} from "react";
import OrdenTrabajoSistemaContext from "./OrdenTrabajoSistemaContext";
import { createOrdenTrabajoSistema,getOrdenTrabajoSistemaByOrdenTrabajo,updateEstadoOrdenTrabajoSistema, updateOrdenTrabajoSistema } from "../../services/OrdenTrabajoSistemaService";

const OrdenTrabajoSistemaProvider = ({ children }) => {
    const [ordenTrabajoSistemas, setOrdenTrabajoSistemas] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const guardarOrdenTrabajoSistema = async (id_orden_trabajo, id_embarcacion_sistema) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createOrdenTrabajoSistema(id_orden_trabajo, id_embarcacion_sistema);
        return response.data; 
      } catch (err) {
        setError(err.message);
        console.error("Error al guardar la orden de trabajo:", err);
      } finally {
        setLoading(false);
      }
    };

    const obtenerOrdenTrabajoSistemaByOrdenTrabajo=async(id_orden_trabajo)=>{
        setLoading(true);
        setError(null);
        try{
          const response = await getOrdenTrabajoSistemaByOrdenTrabajo(id_orden_trabajo);
          setOrdenTrabajoSistemas(response.data);
          return response.data;
        }catch(err){
          setError(err.message);
          console.error("Error al obtener la orden de trabajo:", err);
        }
    }

    const actualizarOrdenTrabajoSistema= async(id_orden_trabajo_sistema, estado)=>{
      setLoading(true);
      setError(null);
      try{
        const response=await updateEstadoOrdenTrabajoSistema(id_orden_trabajo_sistema, estado);
        setLoading(false);
        return response.data;  
      }catch(err){
        setError(err.message);
        console.error("Error al actualizar la orden de trabajo:", err);
      }finally{
        setLoading(false);
      }
    }

    const actualizarOrdenTrabajoSistemaCompleta=async(id_orden_trabajo_sistema, data)=>{
      setLoading(true);
      setError(null);
      try{
        const response=await updateOrdenTrabajoSistema(id_orden_trabajo_sistema, data);
        setLoading(false);
        return response.data;  
      }catch(err){
        setError(err.message);
        console.error("Error al actualizar la orden de trabajo:", err);
      }finally{
        setLoading(false);
      }
    }

    
    return (
        <OrdenTrabajoSistemaContext.Provider value={{ actualizarOrdenTrabajoSistemaCompleta, guardarOrdenTrabajoSistema,obtenerOrdenTrabajoSistemaByOrdenTrabajo, actualizarOrdenTrabajoSistema, ordenTrabajoSistemas, loading, error }}>
          {children}
        </OrdenTrabajoSistemaContext.Provider>
      );
}
export default OrdenTrabajoSistemaProvider