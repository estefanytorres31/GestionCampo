import * as OrdenTrabajoUsuarioService from "../services/OrdenTrabajoUsuarioService.js";

/**
 * Crear una asignación de usuario en Orden de Trabajo
 */
export const createOrdenTrabajoUsuario = async (req, res) => {
    try {
        const asignacion = await OrdenTrabajoUsuarioService.createOrdenTrabajoUsuario(req.body);

        const mensaje = asignacion.creado_en.getTime() === asignacion.actualizado_en.getTime()
            ? "Asignación creada exitosamente."
            : "Asignación reactivada exitosamente.";

        res.status(201).json({ message: mensaje, data: asignacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrdenTrabajoUsuario = async (req, res) => {
    try {
        const asignacion = await OrdenTrabajoUsuarioService.updateOrdenTrabajoUsuario(req.params.id, req.body);
        res.status(200).json({ message: "Asignación actualizada exitosamente.", data: asignacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Obtener todas las asignaciones activas con filtros opcionales
 */
export const getAllOrdenTrabajoUsuarios = async (req, res) => {
    try {
        const asignaciones = await OrdenTrabajoUsuarioService.getAllOrdenTrabajoUsuarios(req.query);
        res.status(200).json({ message: "Asignaciones obtenidas exitosamente.", data: asignaciones });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Obtener una asignación por ID
 */
export const getOrdenTrabajoUsuarioById = async (req, res) => {
    try {
        const asignacion = await OrdenTrabajoUsuarioService.getOrdenTrabajoUsuarioById(req.params.id);
        res.status(200).json({ message: "Asignación obtenida exitosamente.", data: asignacion });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Desactivar una asignación
 */
export const deleteOrdenTrabajoUsuario = async (req, res) => {
    try {
        const asignacion = await OrdenTrabajoUsuarioService.deleteOrdenTrabajoUsuario(req.params.id);
        res.status(200).json({ message: "Asignación desactivada exitosamente.", data: asignacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
