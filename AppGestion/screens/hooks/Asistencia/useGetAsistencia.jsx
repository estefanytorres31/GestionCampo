import { useState, useEffect } from "react";
import { getAsistenciasByOrden } from "../../services/AsistenciaService";

const useAsistencia = (idOrden) => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarEntrada, setMostrarEntrada] = useState(true);
    const [mostrarSalida, setMostrarSalida] = useState(false);

    useEffect(() => {
        const fetchAsistencias = async () => {
            setLoading(true);
            try {
                const asistenciasData = await getAsistenciasByOrden(idOrden);
                setAsistencias(asistenciasData);

                // Verificar si ya hay una entrada o salida registrada
                const tieneEntrada = asistenciasData.some(a => a.tipo === "entrada");
                const tieneSalida = asistenciasData.some(a => a.tipo === "salida");

                setMostrarEntrada(!tieneEntrada); // Ocultar entrada si ya existe
                setMostrarSalida(tieneEntrada && !tieneSalida); // Mostrar salida solo si hay entrada y no hay salida
            } catch (err) {
                setError("Error al cargar asistencias");
            } finally {
                setLoading(false);
            }
        };

        if (idOrden) {
            fetchAsistencias();
        }
    }, [idOrden]);

    return { asistencias, loading, error, mostrarEntrada, mostrarSalida };
};

export default useAsistencia;
