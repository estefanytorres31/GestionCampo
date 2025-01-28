import * as OrdenTrabajoUsuarioService from "../services/OrdenTrabajoUsuarioService.js";

/**
 * Asignar un Usuario a una Orden de Trabajo
 */
export const assignUserToOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo, id_usuario, rol_en_orden, observaciones } = req.body;

    try {
        const asignacion = await OrdenTrabajoUsuarioService.assignUserToOrdenTrabajo({
            id_orden_trabajo,
            id_usuario,
            rol_en_orden,
            observaciones,
        });
        res.status(201).json({ message: "Usuario asignado a la orden de trabajo exitosamente.", data: asignacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Obtener todos los Usuarios asignados a una Orden de Trabajo
 */
export const getUsuariosByOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo } = req.params;

    try {
        const usuariosAsignados = await OrdenTrabajoUsuarioService.getUsuariosByOrdenTrabajo(id_orden_trabajo);
        res.status(200).json({ message: "Usuarios asignados obtenidos exitosamente.", data: usuariosAsignados });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Obtener una Asignación por su ID
 */
export const getAsignacionById = async (req, res) => {
    const { id_orden_trabajo_usuario } = req.params;

    try {
        const asignacion = await OrdenTrabajoUsuarioService.getAsignacionById(id_orden_trabajo_usuario);
        res.status(200).json({ message: "Asignación obtenida exitosamente.", data: asignacion });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Actualizar una Asignación
 */
export const updateAsignacion = async (req, res) => {
    const { id_orden_trabajo_usuario } = req.params;
    const { rol_en_orden, observaciones } = req.body;

    try {
        const asignacionActualizada = await OrdenTrabajoUsuarioService.updateAsignacion(id_orden_trabajo_usuario, { rol_en_orden, observaciones });
        res.status(200).json({ message: "Asignación actualizada exitosamente.", data: asignacionActualizada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Eliminar una Asignación
 */
export const removeAsignacion = async (req, res) => {
    const { id_orden_trabajo_usuario } = req.params;

    try {
        const asignacionEliminada = await OrdenTrabajoUsuarioService.removeAsignacion(id_orden_trabajo_usuario);
        res.status(200).json({ message: "Asignación eliminada exitosamente.", data: asignacionEliminada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Reasignar una Orden de Trabajo a Otros Usuarios
 */
export const reasignarOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo, nuevos_usuarios } = req.body;

    try {
        const resultados = await OrdenTrabajoUsuarioService.reasignarOrdenTrabajo(id_orden_trabajo, nuevos_usuarios);
        res.status(200).json({ message: "Orden de trabajo reasignada exitosamente.", data: resultados });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Generar Reportes de Órdenes de Trabajo
 */
export const generarReporteOrdenesTrabajo = async (req, res) => {
    const filtros = req.query; // Obtener filtros desde query params

    try {
        const reportes = await OrdenTrabajoUsuarioService.generarReporteOrdenesTrabajo(filtros);
        res.status(200).json({ message: "Reporte generado exitosamente.", data: reportes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Generar Informes de Productividad por Usuario Técnico
 */
export const generarInformeProductividad = async (req, res) => {
    const filtros = req.query; // Obtener filtros desde query params

    try {
        const informe = await OrdenTrabajoUsuarioService.generarInformeProductividad(filtros);
        res.status(200).json({ message: "Informe de productividad generado exitosamente.", data: informe });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
