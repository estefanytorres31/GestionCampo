import * as PuertoService from "../services/PuertoService.js";

/**
 * Crear un nuevo puerto.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const createPuerto = async (req, res) => {
    const { nombre, ubicacion } = req.body;

    // Validaciones básicas
    if (!nombre) {
        return res.status(400).json({ message: "El campo 'nombre' es obligatorio." });
    }

    try {
        const puerto = await PuertoService.createPuerto(nombre, ubicacion);
        res.status(201).json({ message: "Puerto creado exitosamente.", data: puerto });
    } catch (error) {
        if (error.code === "DUPLICATE_NOMBRE") {
            return res.status(409).json({ message: error.message }); // Conflicto
        }
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

/**
 * Obtener todos los puertos activos.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const getAllPuertos = async (req, res) => {
    try {
        const puertos = await PuertoService.getAllPuertos();
        res.status(200).json({ message: "Puertos obtenidos exitosamente.", data: puertos });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

/**
 * Obtener un puerto por su ID.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const getPuertoById = async (req, res) => {
    const { id } = req.params;

    // Validación básica
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "El ID proporcionado no es válido." });
    }

    try {
        const puerto = await PuertoService.getPuertoById(parseInt(id));
        res.status(200).json({ message: "Puerto obtenido exitosamente.", data: puerto });
    } catch (error) {
        if (error.code === "NOT_FOUND") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

/**
 * Actualizar un puerto existente.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const updatePuerto = async (req, res) => {
    const { id } = req.params;
    const { nombre, ubicacion } = req.body;

    // Validaciones básicas
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "El ID proporcionado no es válido." });
    }

    if (!nombre) {
        return res.status(400).json({ message: "El campo 'nombre' es obligatorio." });
    }

    try {
        const puerto = await PuertoService.updatePuerto(parseInt(id), nombre, ubicacion);
        res.status(200).json({ message: "Puerto actualizado exitosamente.", data: puerto });
    } catch (error) {
        if (error.code === "NOT_FOUND") {
            return res.status(404).json({ message: error.message });
        }

        if (error.code === "DUPLICATE_NOMBRE") {
            return res.status(409).json({ message: error.message });
        }

        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

/**
 * Desactivar (eliminar) un puerto.
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const deletePuerto = async (req, res) => {
    const { id } = req.params;

    // Validación básica
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "El ID proporcionado no es válido." });
    }

    try {
        const puerto = await PuertoService.deletePuerto(parseInt(id));
        res.status(200).json({ message: "Puerto desactivado exitosamente.", data: puerto });
    } catch (error) {
        if (error.code === "NOT_FOUND") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};
