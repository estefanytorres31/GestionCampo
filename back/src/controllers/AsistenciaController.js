import * as AsistenciaService from "../services/AsistenciaService.js";

/**
 * Crear una Asistencia (Entrada o Salida)
 */
export const crearAsistencia = async (req, res) => {
    
    const {
        id_usuario,
        id_embarcacion,
        tipo, // 'entrada' o 'salida'
        latitud,
        longitud,
        id_orden_trabajo,
    } = req.body;

    try {
        const asistencia = await AsistenciaService.crearAsistencia({
            id_usuario,
            id_embarcacion,
            tipo,
            latitud,
            longitud,
            id_orden_trabajo,
        });
        res.status(201).json({ message: "Asistencia registrada exitosamente.", data: asistencia });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Obtener Asistencias por Usuario
 */
export const obtenerAsistenciasPorUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const asistencias = await AsistenciaService.obtenerAsistenciasPorUsuario(parseInt(id_usuario, 10));
        res.status(200).json({ message: "Asistencias obtenidas exitosamente.", data: asistencias });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener Asistencias por Embarcación
 */
export const obtenerAsistenciasPorEmbarcacion = async (req, res) => {
    const { id_embarcacion } = req.params;

    try {
        const asistencias = await AsistenciaService.obtenerAsistenciasPorEmbarcacion(parseInt(id_embarcacion, 10));
        res.status(200).json({ message: "Asistencias obtenidas exitosamente.", data: asistencias });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Actualizar una Asistencia
 */
export const actualizarAsistencia = async (req, res) => {
    const { id_asistencia } = req.params;
    const data = req.body; // Campos a actualizar

    try {
        const asistenciaActualizada = await AsistenciaService.actualizarAsistencia(parseInt(id_asistencia, 10), data);
        res.status(200).json({ message: "Asistencia actualizada exitosamente.", data: asistenciaActualizada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Eliminar una Asistencia
 */
export const eliminarAsistencia = async (req, res) => {
    const { id_asistencia } = req.params;

    try {
        const asistenciaEliminada = await AsistenciaService.eliminarAsistencia(parseInt(id_asistencia, 10));
        res.status(200).json({ message: "Asistencia eliminada exitosamente.", data: asistenciaEliminada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
