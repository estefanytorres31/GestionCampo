import React, { createContext, useState, useContext } from "react";
import OrdenTrabajoContext from "./OrdenTrabajoContext";
import { createOrdenTrabajo, getOrdenTrabajoById } from "../../services/OrdenTrabajoService";

const OrdenTrabajoProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const guardarOrdenTrabajo = async (id_tipo_trabajo, id_embarcacion, id_puerto, codigo, motorista, supervisor) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createOrdenTrabajo(id_tipo_trabajo, id_embarcacion, id_puerto, codigo, motorista, supervisor);
        return response.data; 
      } catch (err) {
        setError(err.message);
        console.error("Error al guardar la orden de trabajo:", err);
      } finally {
        setLoading(false);
      }
    };

    const obtenerOrdenTrabajo = async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrdenTrabajoById(id);
        return response.data;
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener la orden de trabajo:", err);
      } finally {
        setLoading(false);
      }
    }

    return (
        <OrdenTrabajoContext.Provider value={{ guardarOrdenTrabajo, obtenerOrdenTrabajo, loading, error }}>
          {children}
        </OrdenTrabajoContext.Provider>
      );
}

export default OrdenTrabajoProvider;