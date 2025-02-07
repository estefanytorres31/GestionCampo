import React, { createContext, useState, useContext } from "react";
import OrdenTrabajoContext from "./OrdenTrabajoContext";
import { createOrdenTrabajo, getOrdenTrabajoById, getAllTrabajosByJefeAsig, updateOrdenTrabajo } from "../../services/OrdenTrabajoService";

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

    const obtenerTrabajosPorJefeAsig = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllTrabajosByJefeAsig();
        return response.data;
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los trabajos por jefe de asistencia:", err);
      } finally {
        setLoading(false);
      }
    }

    const actualizarOrdenTrabajo = async (id_orden_trabajo, estado) => {
      setLoading(true);
      setError(null);
      try {
        const response=await updateOrdenTrabajo(id_orden_trabajo, estado);
        return response.data;  // Devuelve la respuesta del API (en este caso, la orden de trabajo actualizada)  // En caso de error, devuelve el mensaje de error en la consola.  // Este es un ejemplo, el mensaje de error puede ser personalizado según sea necesario.  // Este componente debe ser usado dentro de un componente que necesite acceder a estos valores.  // Por ejemplo
      } catch (err) {
        setError(err.message);
        console.error("Error al actualizar la orden de trabajo:", err);
      } finally {
        setLoading(false);
      }
    }

    return (
        <OrdenTrabajoContext.Provider value={{ guardarOrdenTrabajo, obtenerOrdenTrabajo,obtenerTrabajosPorJefeAsig, actualizarOrdenTrabajo, loading, error }}>
          {children}
        </OrdenTrabajoContext.Provider>
      );
}

export default OrdenTrabajoProvider;