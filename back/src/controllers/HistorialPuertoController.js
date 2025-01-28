import * as HistorialPuertoService from "../services/HistorialPuertoService.js";

// Registrar llegada de una embarcación
export const registrarLlegada = async (req, res) => {
    const { embarcacion_id, puerto_id, fecha_llegada } = req.body;

    try {
        const registro = await HistorialPuertoService.registrarLlegada(embarcacion_id, puerto_id, fecha_llegada);
        res.status(201).json({ message: "Llegada registrada exitosamente.", data: registro });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Registrar salida de una embarcación
export const registrarSalida = async (req, res) => {
    const { embarcacion_id, fecha_salida } = req.body;

    try {
        const registro = await HistorialPuertoService.registrarSalida(embarcacion_id, fecha_salida);
        res.status(200).json({ message: "Salida registrada exitosamente.", data: registro });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Consultar puerto actual de una embarcación
export const obtenerPuertoActual = async (req, res) => {
    const { embarcacion_id } = req.params;

    try {
        const puerto = await HistorialPuertoService.obtenerPuertoActual(embarcacion_id);
        res.status(200).json({ message: "Puerto actual obtenido exitosamente.", data: puerto });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Consultar historial de puertos de una embarcación
export const obtenerHistorialPuertos = async (req, res) => {
    const { embarcacion_id } = req.params;
    const { limit } = req.query;

    try {
        const historial = await HistorialPuertoService.obtenerHistorialPuertos(embarcacion_id, parseInt(limit, 10) || 10);
        res.status(200).json({ message: "Historial obtenido exitosamente.", data: historial });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
