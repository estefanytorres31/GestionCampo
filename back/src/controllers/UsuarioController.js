import * as UsuarioService from "../services/UsuarioService.js";

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    const { nombre_usuario, contrasena_hash, nombre_completo, email } = req.body;

    try {
        const usuario = await UsuarioService.createUsuario(nombre_usuario, contrasena_hash, nombre_completo, email);

        // Determinar si se creó un nuevo usuario o se reactivó uno existente
        const mensaje = usuario.estado 
            ? (usuario.creado_en.getTime() === usuario.actualizado_en.getTime()
                ? "Usuario creado exitosamente."
                : "Usuario reactivado exitosamente.")
            : "Usuario creado exitosamente.";

        res.status(201).json({ message: mensaje, data: usuario });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUsersController = async (req, res) => {
    try {
        const filters = {
            nombre_usuario: req.query.nombre_usuario || undefined,
            email: req.query.email || undefined,
            estado: req.query.estado || undefined,
            rol_id: req.query.rol_id || undefined,
        };

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await UsuarioService.getAllUsers(filters, page, pageSize);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFilteredUsers = async (req, res) => {
    try {
        const usuarios = await UsuarioService.getFilteredUsers(req.query);
        res.status(200).json({ message: "Usuarios obtenidos exitosamente.", data: usuarios });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener un usuario por su nombre de usuario
export const getUserByUsername = async (req, res) => {
    const { nombre_usuario } = req.params;

    try {
        const usuario = await UsuarioService.getUserByUsername(nombre_usuario);
        res.status(200).json({ message: "Usuario obtenido exitosamente.", data: usuario });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await UsuarioService.getUserById(id);
        res.status(200).json({ message: "Usuario obtenido exitosamente.", data: usuario });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, nombre_completo, email } = req.body;

    try {
        const usuario = await UsuarioService.updateUser(id, nombre_usuario, nombre_completo, email);
        res.status(200).json({ message: "Usuario actualizado exitosamente.", data: usuario });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar (desactivar) un usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await UsuarioService.deleteUser(id);
        res.status(200).json({ message: "Usuario desactivado exitosamente.", data: usuario });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
