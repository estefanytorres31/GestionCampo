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

        if (permisos.length === 0) {
            return res.status(200).json({ message: "No hay permisos asignados a este rol.", data: [] });
        }

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

        if (roles.length === 0) {
            return res.status(200).json({ message: "No hay roles asignados a este permiso.", data: [] });
        }

        res.status(200).json({ message: "Roles obtenidos exitosamente.", data: roles });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener todas las relaciones entre roles y permisos activas
export const getAllRolesPermisos = async (req, res) => {
    try {
        const rolesPermisos = await RolesPermisoService.getAllRolesPermisos();

        if (rolesPermisos.length === 0) {
            return res.status(404).json({ message: "No hay relaciones activas entre roles y permisos.", data: [] });
        }

        res.status(200).json({ message: "Relaciones entre roles y permisos obtenidas exitosamente.", data: rolesPermisos });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
