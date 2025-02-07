import React, { useState, useEffect } from "react";
import AsistenciaContext from "./AsistenciaContext";
import { createAsistencia, getUltimoAsistenciaByUser } from "../../services/AsistenciaService";

const AsistenciaProvider = ({ children }) => {
    const [lastAttendance, setLastAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasEntrada, setHasEntrada] = useState(false);
    const [hasSalida, setHasSalida] = useState(false);

    const getUltimoAsistencia=async()=>{
        try {
            const response = await getUltimoAsistenciaByUser();
            setLastAttendance(response.data);
            return response.data
        } catch (error) {
            console.error("Error al obtener la última asistencia:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    // Registrar asistencia
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

            // Actualizar estado con el nuevo registro
            setLastAttendance({
                tipo: params.tipo,
                timestamp: new Date().toISOString(),
            });

            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AsistenciaContext.Provider value={{ lastAttendance, loading, registerAttendance, getUltimoAsistencia }}>
            {children}
        </AsistenciaContext.Provider>
    );
};

export default AsistenciaProvider;