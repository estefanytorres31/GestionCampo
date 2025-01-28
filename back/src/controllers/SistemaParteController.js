import * as SistemaParteService from "../services/SistemaParteService.js";

export const createSistemaParte = async (req, res) => {
    const { id_sistema, id_parte } = req.body;

    try {
        const sistemaParte = await SistemaParteService.createSistemaParte(id_sistema, id_parte);
        res.status(201).json({ message: "Asociación creada exitosamente.", data: sistemaParte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const getPartesBySistema = async (req, res) => {
    const { id_sistema } = req.params;

    try {
        const partes = await SistemaParteService.getPartesBySistema(parseInt(id_sistema, 10));
        res.status(200).json({ message: "Partes obtenidas exitosamente.", data: partes });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const updateSistemaParte = async (req, res) => {
    const { id_sistema_parte } = req.params;
    const data = req.body;

    try {
        const sistemaParte = await SistemaParteService.updateSistemaParte(parseInt(id_sistema_parte, 10), data);
        res.status(200).json({ message: "Asociación actualizada exitosamente.", data: sistemaParte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};