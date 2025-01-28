import * as OrdenTrabajoService from "../services/OrdenTrabajoService.js";

// Asignar un Trabajo a una Embarcación
export const asignarTrabajoAEmbarcacion = async (req, res) => {
    const { id_tipo_trabajo, id_embarcacion, id_puerto, id_jefe_asigna, comentarios } = req.body;

    try {
        const ordenTrabajo = await OrdenTrabajoService.asignarTrabajoAEmbarcacion({
            id_tipo_trabajo,
            id_embarcacion,
            id_puerto,
            id_jefe_asigna,
            comentarios,
        });
        res.status(201).json({ message: "Trabajo asignado a la embarcación exitosamente.", data: ordenTrabajo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Gestionar el Estado de la Orden de Trabajo
export const gestionarEstadoOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo, nuevo_estado } = req.body;

    try {
        const ordenTrabajoActualizada = await OrdenTrabajoService.gestionarEstadoOrdenTrabajo(id_orden_trabajo, nuevo_estado);
        res.status(200).json({ message: "Estado de la orden de trabajo actualizado exitosamente.", data: ordenTrabajoActualizada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar el Estado de la Orden de Trabajo
export const actualizarEstadoOrdenTrabajo = async (req, res) => {
    const { id_orden_trabajo } = req.params;
    const { nuevo_estado } = req.body;

    try {
        const ordenTrabajoActualizada = await OrdenTrabajoService.actualizarEstadoOrdenTrabajo(id_orden_trabajo, nuevo_estado);
        res.status(200).json({ message: "Estado de la orden de trabajo actualizado exitosamente.", data: ordenTrabajoActualizada });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Asignar múltiples Ordenes de Trabajo a una Embarcación
export const asignarMultipleOrdenesTrabajoAEmbarcacion = async (req, res) => {
    const { ordenes } = req.body;

    try {
        const ordenesTrabajo = await OrdenTrabajoService.asignarMultipleOrdenesTrabajoAEmbarcacion(ordenes);
        res.status(201).json({ message: "Múltiples órdenes de trabajo asignadas exitosamente.", data: ordenesTrabajo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};