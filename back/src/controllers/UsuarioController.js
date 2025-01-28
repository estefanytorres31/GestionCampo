import * as UsuarioService from "../services/UsuarioService.js";

export const createUsuario = async (req, res) => {
    const {nombre_usuario, contrasena_hash, nombre_completo, email, roles_ids}=req.body;
    try{
        const usuario = await UsuarioService.createUsuario(nombre_usuario, contrasena_hash, nombre_completo, email,roles_ids);
        res.status(201).json(usuario);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const getUserByUsername=async(req, res) => {
    const {nombre_usuario} = req.params;
    try{
        const usuario = await UsuarioService.getUserByUsername(nombre_usuario);
        res.status(200).json(usuario);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    //console.log("ID recibido:", id);
    try {
        const usuario = await UsuarioService.getUserById(id);
        //console.log("Usuario encontrado:", usuario);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUser=async (req, res) => {
    const {id} = req.params;
    const {nombre_usuario, nombre_completo, email}=req.body;
    try{
        const usuario = await UsuarioService.updateUser(id, nombre_usuario, nombre_completo, email);
        res.status(200).json(usuario);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const deleteUser=async (req, res) => {
    const {id} = req.params;
    try{
        await UsuarioService.deleteUser(id);
        res.status(204).send({message: 'Usuario eliminado'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const getAllUsers=async (req, res) => {
    try{
        const usuarios = await UsuarioService.getAllUsers();
        res.status(200).json(usuarios);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}