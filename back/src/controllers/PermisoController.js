// src/controllers/PermisoController.js
import * as PermisoService from "../services/PermisoService.js";

// Crear un nuevo permiso
export const createPermiso = async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const permiso = await PermisoService.createPermiso(nombre, descripcion);

        // Determinar si se creó un nuevo permiso o se reactivó uno existente
        const mensaje = permiso.estado 
            ? (permiso.creado_en.getTime() === permiso.actualizado_en.getTime()
                ? "Permiso creado exitosamente."
                : "Permiso reactivado exitosamente.")
            : "Permiso creado exitosamente.";

        res.status(201).json({ message: mensaje, data: permiso });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los permisos
export const getAllPermisosController = async (req, res) => {
    try {
        const filters = {
            nombre: req.query.nombre || undefined,
            estado: req.query.estado || undefined,
        };

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await PermisoService.getAllPermisos(filters, page, pageSize);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un permiso por su ID
export const getPermisoById = async (req, res) => {
    const { id } = req.params;

    try {
        const permiso = await PermisoService.getPermisoById(id);
        res.status(200).json({ message: "Permiso obtenido exitosamente.", data: permiso });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Actualizar un permiso
export const updatePermiso = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const permiso = await PermisoService.updatePermiso(id, nombre, descripcion);
        res.status(200).json({ message: "Permiso actualizado exitosamente.", data: permiso });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar (desactivar) un permiso
export const deletePermiso = async (req, res) => {
    const { id } = req.params;

    try {
        const permiso = await PermisoService.deletePermiso(id);
        res.status(200).json({ message: "Permiso desactivado exitosamente.", data: permiso });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};