import * as EmbarcacionSistemaParteService from "../services/EmbarcacionSistemaParteService.js";

export const assignParteToEmbarcacionSistema = async (req, res) => {
    const { id_embarcacion_sistema, id_parte } = req.body;

    try {
        const embarcacionSistemaParte = await EmbarcacionSistemaParteService.assignParteToEmbarcacionSistema(id_embarcacion_sistema, id_parte);
        res.status(201).json({ message: "Parte asignada exitosamente.", data: embarcacionSistemaParte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const getPartesByEmbarcacionSistema = async (req, res) => {
    const { id_embarcacion_sistema } = req.params;

    try {
        const partes = await EmbarcacionSistemaParteService.getPartesByEmbarcacionSistema(parseInt(id_embarcacion_sistema, 10));
        res.status(200).json({ message: "Partes obtenidas exitosamente.", data: partes });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const updateEmbarcacionSistemaParte = async (req, res) => {
    const { id_embarcacion_sistema_parte } = req.params;
    const data = req.body;

    try {
        const embarcacionSistemaParte = await EmbarcacionSistemaParteService.updateEmbarcacionSistemaParte(parseInt(id_embarcacion_sistema_parte, 10), data);
        res.status(200).json({ message: "Asociación actualizada exitosamente.", data: embarcacionSistemaParte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const deleteEmbarcacionSistemaParte = async (req, res) => {
    const { id_embarcacion_sistema_parte } = req.params;

    try {
        const embarcacionSistemaParte = await EmbarcacionSistemaParteService.deleteEmbarcacionSistemaParte(parseInt(id_embarcacion_sistema_parte, 10));
        res.status(200).json({ message: "Asociación eliminada exitosamente.", data: embarcacionSistemaParte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};