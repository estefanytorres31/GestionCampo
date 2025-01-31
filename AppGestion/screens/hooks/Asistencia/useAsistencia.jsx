import { useContext, useState, useEffect } from "react";
import AsistenciaContext from "../../context/Asistencia/AsistenciaContext";
import { getAsistenciasByOrdenTrabajo } from "../../services/AsistenciaService";

const useAsistencia = () => {
    const context = useContext(AsistenciaContext);
    
    const [hasEntrada, setHasEntrada] = useState(false);
    const [hasSalida, setHasSalida] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchLastAttendance = async (idOrdenTrabajo) => {
        setLoading(true);
        try {
            const asistencias = await getAsistenciasByOrdenTrabajo(idOrdenTrabajo);
            
            // Verifica si ya hay registros de entrada o salida
            const hasEntrada = asistencias.some(reg => reg.tipo === "entrada");
            const hasSalida = asistencias.some(reg => reg.tipo === "salida");

            setHasEntrada(hasEntrada);
            setHasSalida(hasSalida);
        } catch (error) {
            console.error("Error obteniendo registros de asistencia:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        ...context,
        hasEntrada,
        hasSalida,
        fetchLastAttendance,
        loading
    };
};

export default useAsistencia;
