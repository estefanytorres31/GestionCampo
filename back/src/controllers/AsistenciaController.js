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
 * Obtener la lista de asistencias con cálculos de entrada y salida
 */
export const getAsistenciasController = async (req, res) => {
    try {
        const filters = {
            nombre_completo: req.query.nombre_completo || undefined,
            fecha: req.query.fecha || undefined,
            nombre_embarcacion: req.query.nombre_embarcacion || undefined, // Cambiado de id_embarcacion a nombre_embarcacion
        };

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await AsistenciaService.getAsistencias(filters, page, pageSize);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 🔹 Obtener Asistencias con Filtros
 */
export const obtenerAsistencias = async (req, res) => {
    try {
        const asistencias = await AsistenciaService.obtenerAsistencias(req.query);
        res.status(200).json({
            message: "Asistencias obtenidas exitosamente.",
            data: asistencias,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * 🔹 Obtener una Asistencia por su ID
 */
export const obtenerAsistenciaPorId = async (req, res) => {
    try {
        const asistencia = await AsistenciaService.obtenerAsistenciaPorId(req.params.id);
        res.status(200).json({
            message: "Asistencia obtenida exitosamente.",
            data: asistencia,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
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


export const getLastAsistenciaByUsusario=async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const lastAsistencia = await AsistenciaService.obtenerUltimaAsistencia(id_usuario);
        res.status(200).json({ message: "Última asistencia obtenida exitosamente.", data: lastAsistencia });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}