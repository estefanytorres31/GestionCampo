// src/controllers/RolesPermisoController.js
import * as RolesPermisoService from "../services/RolesPermisoService.js";

// Asignar un permiso a un rol
export const assignPermisoToRol = async (req, res) => {
    const { rol_id, permiso_id } = req.body;

    try {
        const relacion = await RolesPermisoService.assignPermisoToRol(rol_id, permiso_id);
        res.status(201).json({ message: "Permiso asignado al rol exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Quitar un permiso de un rol
export const removePermisoFromRol = async (req, res) => {
    const { rol_id, permiso_id } = req.body;

    try {
        const relacion = await RolesPermisoService.removePermisoFromRol(rol_id, permiso_id);
        res.status(200).json({ message: "Permiso removido del rol exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los permisos de un rol
export const getPermisosByRol = async (req, res) => {
    const { rol_id } = req.params;

    try {
        const permisos = await RolesPermisoService.getPermisosByRol(rol_id);
        res.status(200).json({ message: "Permisos obtenidos exitosamente.", data: permisos });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener todos los roles que tienen un permiso específico
export const getRolesByPermiso = async (req, res) => {
    const { permiso_id } = req.params;

    try {
        const roles = await RolesPermisoService.getRolesByPermiso(permiso_id);
        res.status(200).json({ message: "Roles obtenidos exitosamente.", data: roles });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
