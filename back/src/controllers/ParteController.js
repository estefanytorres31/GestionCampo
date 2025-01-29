import * as ParteService from "../services/ParteService.js";

/**
 * Crear o reactivar una parte.
 */
export const createParte = async (req, res) => {
    const { nombre_parte } = req.body;

    try {
        const parte = await ParteService.createParte(nombre_parte);

        // Determinar si se creó una nueva parte o se reactivó una existente
        const mensaje = parte.creado_en.getTime() === parte.actualizado_en.getTime()
            ? "Parte creada exitosamente."
            : "Parte reactivada exitosamente.";

        res.status(201).json({ message: mensaje, data: parte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener todas las partes activas.
 */
export const getAllPartes = async (req, res) => {
    try {
        const partes = await ParteService.getAllPartes();
        res.status(200).json({ message: "Partes obtenidas exitosamente.", data: partes });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener una parte por su ID.
 */
export const getParteById = async (req, res) => {
    const { id } = req.params;

    try {
        const parte = await ParteService.getParteById(id);
        res.status(200).json({ message: "Parte obtenida exitosamente.", data: parte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Actualizar una parte existente.
 */
export const updateParte = async (req, res) => {
    const { id_parte } = req.params;
    const { nombre_parte } = req.body;

    try {
        const parteActualizada = await ParteService.updateParte(id_parte, nombre_parte);
        res.status(200).json({ message: "Parte actualizada exitosamente.", data: parteActualizada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Desactivar una parte.
 */
export const deleteParte = async (req, res) => {
    const { id_parte } = req.params;

    try {
        const parteDesactivada = await ParteService.deleteParte(id_parte);
        res.status(200).json({ message: "Parte desactivada exitosamente.", data: parteDesactivada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};