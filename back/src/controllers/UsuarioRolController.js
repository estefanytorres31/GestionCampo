import * as UsuarioRolService from "../services/UsuarioRolService.js";

// 🔹 Asignar un rol a un usuario
export const assignRolToUsuario = async (req, res) => {
    const { usuario_id, rol_id } = req.body;

    try {
        const relacion = await UsuarioRolService.assignRolToUsuario(usuario_id, rol_id);
        res.status(201).json({ message: "Rol asignado al usuario exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Remover un rol de un usuario
export const removeRolFromUsuario = async (req, res) => {
    const { usuario_id, rol_id } = req.body;

    try {
        const relacion = await UsuarioRolService.removeRolFromUsuario(usuario_id, rol_id);
        res.status(200).json({ message: "Rol removido del usuario exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Obtener todos los roles de un usuario
export const getRolesByUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const roles = await UsuarioRolService.getRolesByUsuario(usuario_id);
        res.status(200).json({ message: "Roles obtenidos exitosamente.", data: roles });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// 🔹 Obtener todos los usuarios con un rol específico
export const getUsuariosByRol = async (req, res) => {
    const { rol_id } = req.params;

    try {
        const usuarios = await UsuarioRolService.getUsuariosByRol(rol_id);
        res.status(200).json({ message: "Usuarios obtenidos exitosamente.", data: usuarios });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
