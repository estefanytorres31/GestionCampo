import * as RolService from "../services/RolService.js";

export const createRol = async (req, res) => {
    const {nombre_rol} = req.body;
    try {
        const nuevoRol = await RolService.createRol(nombre_rol);
        res.status(201).json(nuevoRol);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


export const obtenerTodosLosRoles = async (req, res) => {
    try {
        const roles = await RolService.obtenerTodosLosRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const actualizarRol = async (req, res) => {
    const {id} = req.params;
    const {nombre_rol} = req.body;
    try {
        const rolActualizado = await RolService.actualizarRol(id, nombre_rol);
        res.json(rolActualizado);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const eliminarRol = async (req, res) => {
    const {id} = req.params;
    try {
        await RolService.eliminarRol(id);
        res.status(204).json({message:'Rol eliminado'});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const getRolById = async (req, res) => {
    const {id} = req.params;
    try {
        const rol = await RolService.getRolById(id);
        if (!rol) return res.status(404).json({message: "Rol no encontrado"});
        res.json(rol);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
