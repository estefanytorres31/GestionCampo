import * as PuertoService from "../services/PuertoService.js";

// Crear un nuevo puerto
export const createPuerto = async (req, res) => {
    const { nombre, ubicacion } = req.body;
    try {
        const puerto = await PuertoService.createPuerto(nombre, ubicacion);
        res.status(201).json(puerto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los puertos
export const getAllPuertos = async (req, res) => {
    try {
        const puertos = await PuertoService.getAllPuertos();
        res.status(200).json(puertos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un puerto por ID
export const getPuertoById = async (req, res) => {
    const { id } = req.params;
    try {
        const puerto = await PuertoService.getPuertoById(id);
        if (!puerto) {
            return res.status(404).json({ message: "Puerto no encontrado o inactivo" });
        }
        res.status(200).json(puerto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un puerto
export const updatePuerto = async (req, res) => {
    const { id } = req.params;
    const { nombre, ubicacion } = req.body;
    try {
        const puerto = await PuertoService.updatePuerto(id, nombre, ubicacion);
        res.status(200).json(puerto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar (desactivar) un puerto
export const deletePuerto = async (req, res) => {
    const { id } = req.params;
    try {
        const puerto = await PuertoService.deletePuerto(id);
        res.status(200).json(puerto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
