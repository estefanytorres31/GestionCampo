import * as EmbarcacionSistemaParteService from "../services/EmbarcacionSistemaParteService.js";

/**
 * Asignar una Parte a un Sistema en una Embarcación
 */
export const assignParteToEmbarcacionSistema = async (req, res) => {
    const { id_embarcacion_sistema, id_parte } = req.body;

    try {
        const relacion = await EmbarcacionSistemaParteService.assignParteToEmbarcacionSistema(id_embarcacion_sistema, id_parte);

        // Determinar si se creó una nueva asociación o se reactivó una existente
        const mensaje = relacion.creado_en.getTime() === relacion.actualizado_en.getTime()
            ? "Parte asignada exitosamente."
            : "Parte reactivada exitosamente.";

        res.status(201).json({ message: mensaje, data: relacion });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener Todas las Partes de un Sistema en una Embarcación
 */
export const getPartesByEmbarcacionSistema = async (req, res) => {
    const { id_embarcacion_sistema } = req.params;

    try {
        const partes = await EmbarcacionSistemaParteService.getPartesByEmbarcacionSistema(parseInt(id_embarcacion_sistema, 10));
        res.status(200).json({ message: "Partes obtenidas exitosamente.", data: partes });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Actualizar una Asociación entre Embarcación, Sistema y Parte
 */
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

/**
 * Desactivar una Asociación entre Embarcación, Sistema y Parte
 */
export const deleteEmbarcacionSistemaParte = async (req, res) => {
    const { id_embarcacion_sistema_parte } = req.params;

    try {
        const embarcacionSistemaParte = await EmbarcacionSistemaParteService.deleteEmbarcacionSistemaParte(parseInt(id_embarcacion_sistema_parte, 10));
        res.status(200).json({ message: "Asociación desactivada exitosamente.", data: embarcacionSistemaParte });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Reactivar una Asociación previamente desactivada
 */
export const reactivateEmbarcacionSistemaParte = async (req, res) => {
    const { id_embarcacion_sistema, id_parte } = req.body;

    try {
        const relacion = await EmbarcacionSistemaParteService.reactivateEmbarcacionSistemaParte(id_embarcacion_sistema, id_parte);
        res.status(200).json({ message: "Asociación reactivada exitosamente.", data: relacion });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener todas las embarcaciones con sus sistemas y partes activas
 */
export const getAllEmbarcacionesWithSistemasAndPartes = async (req, res) => {
    try {
        const embarcaciones = await EmbarcacionSistemaParteService.getAllEmbarcacionesWithSistemasAndPartes();
        res.status(200).json({ message: "Embarcaciones y sus sistemas obtenidos exitosamente.", data: embarcaciones });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};