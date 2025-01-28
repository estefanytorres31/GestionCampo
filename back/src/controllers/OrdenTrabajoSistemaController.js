import * as OrdenTrabajoSistemaService from "../services/OrdenTrabajoSistemaService.js";

/**
 * Asignar un Sistema a una Orden de Trabajo
 */
export const assignSistemaToOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo, id_sistema, id_embarcacion_sistema, observaciones } = req.body;

    try {
        const asignacion = await OrdenTrabajoSistemaService.assignSistemaToOrdenTrabajo({
            id_orden_trabajo,
            id_sistema,
            id_embarcacion_sistema,
            observaciones,
        });
        res.status(201).json({ message: "Sistema asignado a la orden de trabajo exitosamente.", data: asignacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Modificar la Asignación de Sistemas a una Orden de Trabajo
 */
export const modificarAsignacionSistema = async (req, res) => {
    const { id_orden_trabajo_sistema } = req.params;
    const { estado, observaciones } = req.body;

    try {
        const asignacionActualizada = await OrdenTrabajoSistemaService.modificarAsignacionSistema(id_orden_trabajo_sistema, { estado, observaciones });
        res.status(200).json({ message: "Asignación de sistema modificada exitosamente.", data: asignacionActualizada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Desactivar un Sistema de una Orden de Trabajo
 */
export const deactivateSistemaFromOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo_sistema } = req.body;

    try {
        const asignacionDesactivada = await OrdenTrabajoSistemaService.deactivateSistemaFromOrdenTrabajo(id_orden_trabajo_sistema);
        res.status(200).json({ message: "Sistema desactivado de la orden de trabajo exitosamente.", data: asignacionDesactivada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Visualizar Sistemas Asignados a una Orden de Trabajo
 */
export const getSistemasByOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo } = req.params;

    try {
        const sistemasAsignados = await OrdenTrabajoSistemaService.getSistemasByOrdenTrabajo(id_orden_trabajo);
        res.status(200).json({ message: "Sistemas asignados obtenidos exitosamente.", data: sistemasAsignados });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Generar Reportes de Ordenes de Trabajo con Sistemas
 */
export const generarReporteOrdenesTrabajoConSistemas = async (req, res) => {
    const filtros = req.query; // Obtener filtros desde query params

    try {
        const reportes = await OrdenTrabajoSistemaService.generarReporteOrdenesTrabajoConSistemas(filtros);
        res.status(200).json({ message: "Reporte generado exitosamente.", data: reportes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Finalizar una Orden de Trabajo y Actualizar Estados
 */
export const finalizarOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo } = req.params;

    try {
        const ordenFinalizada = await OrdenTrabajoSistemaService.finalizarOrdenTrabajo(id_orden_trabajo);
        res.status(200).json({ message: "Orden de trabajo finalizada exitosamente.", data: ordenFinalizada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Reasignar una Orden de Trabajo a Otros Usuarios
 */
export const reasignarOrdenTrabajoAUsuarios = async (req, res) => {
    const { id_orden_trabajo, nuevos_usuarios } = req.body;

    try {
        const resultados = await OrdenTrabajoSistemaService.reasignarOrdenTrabajoAUsuarios(id_orden_trabajo, nuevos_usuarios);
        res.status(200).json({ message: "Orden de trabajo reasignada a nuevos usuarios exitosamente.", data: resultados });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};