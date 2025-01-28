import * as ParteService from "../services/ParteService.js";

// Crear una parte
export const createParte = async (req, res) => {
    const { nombre_parte } = req.body;

    try {
        const parte = await ParteService.createParte(nombre_parte);
        res.status(201).json({ message: "Parte creada exitosamente.", data: parte });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las partes activas
export const getAllPartes = async (req, res) => {
    try {
        const partes = await ParteService.getAllPartes();
        res.status(200).json({ message: "Partes obtenidas exitosamente.", data: partes });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener una parte por ID
export const getParteById = async (req, res) => {
    const { id } = req.params;
    try {
        const parte = await ParteService.getParteById(id);
        res.status(200).json({ message: "Parte obtenida exitosamente.", data: parte });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


// Actualizar una parte
export const updateParte = async (req, res) => {
    const { id_parte } = req.params;
    const { nombre_parte } = req.body;

    try {
        const updatedParte = await ParteService.updateParte(id_parte, nombre_parte);
        res.status(200).json({ message: "Parte actualizada exitosamente.", data: updatedParte });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Desactivar una parte
export const deleteParte = async (req, res) => {
    const { id_parte } = req.params;

    try {
        const deletedParte = await ParteService.deleteParte(id_parte);
        res.status(200).json({ message: "Parte desactivada exitosamente.", data: deletedParte });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
