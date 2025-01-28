import * as SistemaService from "../services/SistemaService.js";

// Crear o reactivar un sistema
export const createSistema = async (req, res) => {
    const { nombre_sistema, descripcion } = req.body;

    try {
        const sistema = await SistemaService.createSistema(nombre_sistema, descripcion);
        // Determinar si se creó un nuevo sistema o se reactivó uno existente
        const mensaje = sistema.estado ?
            (sistema.creado_en.getTime() === sistema.actualizado_en.getTime() ?
                "Sistema creado exitosamente." :
                "Sistema reactivado exitosamente.") :
            "Sistema creado exitosamente.";

        res.status(201).json({ message: mensaje, data: sistema });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los sistemas
export const getAllSistemas = async (req, res) => {
    try {
        const sistemas = await SistemaService.getAllSistemas();
        res.status(200).json({ message: "Sistemas obtenidos exitosamente.", data: sistemas });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener un sistema por su ID
export const getSistemaById = async (req, res) => {
    const { id } = req.params;

    try {
        const sistema = await SistemaService.getSistemaById(id);
        res.status(200).json({ message: "Sistema obtenido exitosamente.", data: sistema });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Actualizar un sistema
export const updateSistema = async (req, res) => {
    const { id } = req.params;
    const { nombre_sistema, descripcion, estado } = req.body;

    try {
        const sistema = await SistemaService.updateSistema(id, nombre_sistema, descripcion, estado);
        res.status(200).json({ message: "Sistema actualizado exitosamente.", data: sistema });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar (desactivar) un sistema
export const deleteSistema = async (req, res) => {
    const { id } = req.params;

    try {
        const sistema = await SistemaService.deleteSistema(id);
        res.status(200).json({ message: "Sistema desactivado exitosamente.", data: sistema });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
