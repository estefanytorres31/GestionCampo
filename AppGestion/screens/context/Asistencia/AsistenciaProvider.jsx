import React, { useState, useEffect } from "react";
import AsistenciaContext from "./AsistenciaContext";
import { Alert } from "react-native";
import { createAsistencia, getAsistenciasByOrden } from "../../services/AsistenciaService";

const AsistenciaProvider = ({ children }) => {
    const [lastAttendance, setLastAttendance] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar asistencias previas
    const loadLastAttendance = async (idOrden) => {
        try {
            const asistencias = await getAsistenciasByOrden(idOrden);
            if (asistencias.length > 0) {
                const lastEntry = asistencias[asistencias.length - 1]; // Último registro
                setLastAttendance(lastEntry);
            } else {
                setLastAttendance(null);
            }
        } catch (error) {
            console.error("Error cargando la última asistencia:", error);
        }
    };

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

    return (
        <AsistenciaContext.Provider value={{ lastAttendance, loading, registerAttendance, loadLastAttendance }}>
            {children}
        </AsistenciaContext.Provider>
    );
};

export default AsistenciaProvider;
