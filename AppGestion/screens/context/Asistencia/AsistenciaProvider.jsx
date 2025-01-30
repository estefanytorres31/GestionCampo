import React ,{useState} from "react";
import AsistenciaContext from "./AsistenciaContext";
import {Alert} from "react-native";
import { createAsistencia } from "../../services/AsistenciaService";


const AsistenciaProvider = ({ children }) => {
    const [lastAttendance, setLastAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const registerAttendance = async (params) => {
      setLoading(true);
      try {
        const response = await createAsistencia(
          params.id_embarcacion,
          params.tipo,
          params.latitud,
          params.longitud,
          params.id_orden_trabajo
        );
        
        setLastAttendance({
          tipo: params.tipo,
          timestamp: new Date().toISOString(),
        });
        
        Alert.alert(
          "Éxito",
          `Se registró correctamente la ${params.tipo === 'entrada' ? 'entrada' : 'salida'}`
        );
        
        return response.data;
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "No se pudo registrar la asistencia"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const value = {
      lastAttendance,
      loading,
      registerAttendance,
    };
  
    return (
      <AsistenciaContext.Provider value={value}>
        {children}
      </AsistenciaContext.Provider>
    );
  };

export default AsistenciaProvider;