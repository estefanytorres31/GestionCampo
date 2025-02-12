import React, { useState } from "react";
import OrdenTrabajoUsuarioContext from "./OrdenTrabajoUsuarioContext";
import { createOrdenTrabajoUsuario, getOrdenTrabajoUsuarioByUserId, reasignarOTOtroUsuario, getOrdenTrabajoUsuarioByOT } from "../../services/OrdenTrabajoUsuarioService";
const OrdenTrabajoUsuarioProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const guardarOrdenTrabajoUsuario = async (id_orden_trabajo, id_usuario, rol_en_orden) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createOrdenTrabajoUsuario(id_orden_trabajo, id_usuario, rol_en_orden);
        return response.data; 
      } catch (err) {
        setError(err.message);
        console.error("Error al guardar la orden de trabajo del usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    const getOrdenTrabajoUsuarioByUsuario=async()=>{
      setLoading(true);
      setError(null);
      try {
        const response = await getOrdenTrabajoUsuarioByUserId();
        return response.data;
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener las ordenes de trabajo del usuario:", err);
      } finally {
        setLoading(false);
      }
    }

    const getOrdenTrabajoUsuarioByOrden = async (id_orden_trabajo) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrdenTrabajoUsuarioByOT(id_orden_trabajo);
        return response.data;
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener las ordenes de trabajo de la orden:", err);
      } finally {
        setLoading(false);
      }
    }

    const reasignarOT = async (id_orden_trabajo, id_usuario_nuevo) => {
      setLoading(true);
      setError(null);
      try {
        const response=await reasignarOTOtroUsuario(id_orden_trabajo, id_usuario_nuevo);
        return response.data;
      } catch (err) {
        setError(err.message);
        console.error("Error al reasignar la orden de trabajo:", err);
      } finally {
        setLoading(false);
      }
    }
    return (
        <OrdenTrabajoUsuarioContext.Provider value={{ guardarOrdenTrabajoUsuario,getOrdenTrabajoUsuarioByUsuario,reasignarOT,getOrdenTrabajoUsuarioByOrden, loading, error }}>
          {children}
        </OrdenTrabajoUsuarioContext.Provider>
      );

}

export default OrdenTrabajoUsuarioProvider;