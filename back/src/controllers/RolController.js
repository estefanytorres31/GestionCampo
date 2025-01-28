import * as RolService from "../services/RolService.js";

// Crear un nuevo rol
export const createRol = async (req, res) => {
    const { nombre_rol, descripcion } = req.body;

    try {
        const rol = await RolService.createRol(nombre_rol, descripcion);
        // Determinar si se creó un nuevo rol o se reactivó uno existente
        const mensaje = rol.estado ? 
            (rol.creado_en === rol.actualizado_en ? 
                "Rol creado exitosamente." : 
                "Rol reactivado exitosamente.") 
            : "Rol creado exitosamente.";

        res.status(201).json({ message: mensaje, data: rol });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Obtener todos los roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await RolService.getAllRoles();
        res.status(200).json({ message: "Roles obtenidos exitosamente.", data: roles });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener un rol por su ID
export const getRolById = async (req, res) => {
    const { id } = req.params;

    try {
        const rol = await RolService.getRolById(id);
        res.status(200).json({ message: "Rol obtenido exitosamente.", data: rol });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Actualizar un rol
export const updateRol = async (req, res) => {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;

    try {
        const rol = await RolService.updateRol(id, nombre_rol, descripcion);
        res.status(200).json({ message: "Rol actualizado exitosamente.", data: rol });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar (desactivar) un rol
export const deleteRol = async (req, res) => {
    const { id } = req.params;

    try {
        const rol = await RolService.deleteRol(id);
        res.status(200).json({ message: "Rol desactivado exitosamente.", data: rol });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
