import * as EmbarcacionSistemaService from "../services/EmbarcacionSistemaService.js";

// Asignar un sistema a una embarcación
export const assignSistemaToEmbarcacion = async (req, res) => {
    const { id_embarcacion, id_sistema } = req.body;

    try {
        const relacion = await EmbarcacionSistemaService.assignSistemaToEmbarcacion(id_embarcacion, id_sistema);
        res.status(201).json({ message: "Sistema asignado a la embarcación exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Asignar múltiples sistemas a una embarcación
export const assignMultipleSistemasToEmbarcacion = async (req, res) => {
    const { id_embarcacion, sistemas_ids } = req.body;

    try {
        const relaciones = await EmbarcacionSistemaService.assignMultipleSistemasToEmbarcacion(id_embarcacion, sistemas_ids);
        res.status(201).json({ message: "Sistemas asignados a la embarcación exitosamente.", data: relaciones });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Desactivar un sistema de una embarcación
export const deactivateSistemaFromEmbarcacion = async (req, res) => {
    const { id_embarcacion, id_sistema } = req.body;

    try {
        const relacion = await EmbarcacionSistemaService.deactivateSistemaFromEmbarcacion(id_embarcacion, id_sistema);
        res.status(200).json({ message: "Sistema desactivado de la embarcación exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Reactivar un sistema previamente desactivado de una embarcación
export const reactivateSistemaFromEmbarcacion = async (req, res) => {
    const { id_embarcacion, id_sistema } = req.body;

    try {
        const relacion = await EmbarcacionSistemaService.reactivateSistemaFromEmbarcacion(id_embarcacion, id_sistema);
        res.status(200).json({ message: "Sistema reactivado de la embarcación exitosamente.", data: relacion });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Consultar sistemas activos de una embarcación
export const getActiveSistemasByEmbarcacion = async (req, res) => {
    const { id_embarcacion } = req.params;

    try {
        const sistemas = await EmbarcacionSistemaService.getActiveSistemasByEmbarcacion(id_embarcacion);
        res.status(200).json({ message: "Sistemas activos obtenidos exitosamente.", data: sistemas });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Consultar sistemas activos de una embarcación
export const getIDSistemasEmbarcacion = async (req, res) => {
    const { id_embarcacion } = req.params;

    try {
        const sistemas = await EmbarcacionSistemaService.getIDSistemasEmbarcacion(id_embarcacion);
        res.status(200).json({ message: "ID de embarcacion_sistema de una embarcion obtenidos exitosamente.", data: sistemas });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Consultar todas las embarcaciones con sus sistemas activos
export const getAllEmbarcacionesWithSistemas = async (req, res) => {
    try {
        const embarcaciones = await EmbarcacionSistemaService.getAllEmbarcacionesWithSistemas();
        res.status(200).json({ message: "Embarcaciones y sus sistemas obtenidos exitosamente.", data: embarcaciones });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};