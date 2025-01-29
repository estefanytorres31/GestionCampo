import * as SistemaParteService from "../services/SistemaParteService.js";

/**
 * Asignar una Parte a un Sistema en una Embarcación
 */
export const assignSistemaParte = async (req, res) => {
    const { id_sistema, id_parte } = req.body;

    try {
        const relacion = await SistemaParteService.assignSistemaParte(id_sistema, id_parte);

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
export const getPartesBySistema = async (req, res) => {
    const { id_sistema } = req.params;

    try {
        const partes = await SistemaParteService.getPartesBySistema(parseInt(id_sistema, 10));
        res.status(200).json({ message: "Partes obtenidas exitosamente.", data: partes });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Actualizar una Asociación entre Sistema y Parte
 */
export const updateSistemaParte = async (req, res) => {
    const { id_sistema_parte } = req.params;
    const data = req.body;

    try {
        const sistemaParteActualizada = await SistemaParteService.updateSistemaParte(parseInt(id_sistema_parte, 10), data);
        res.status(200).json({ message: "Asociación actualizada exitosamente.", data: sistemaParteActualizada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Desactivar una Asociación entre Sistema y Parte
 */
export const deleteSistemaParte = async (req, res) => {
    const { id_sistema_parte } = req.params;

    try {
        const sistemaParteDesactivada = await SistemaParteService.deleteSistemaParte(parseInt(id_sistema_parte, 10));
        res.status(200).json({ message: "Asociación desactivada exitosamente.", data: sistemaParteDesactivada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Reactivar una Asociación previamente desactivada
 */
export const reactivateSistemaParte = async (req, res) => {
    const { id_sistema, id_parte } = req.body;

    try {
        const relacionReactivada = await SistemaParteService.reactivateSistemaParte(id_sistema, id_parte);
        res.status(200).json({ message: "Asociación reactivada exitosamente.", data: relacionReactivada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener todas las asociaciones activas con detalles
 */
export const getAllSistemasWithPartes = async (req, res) => {
    try {
        const asociaciones = await SistemaParteService.getAllSistemasWithPartes();
        res.status(200).json({ message: "Asociaciones obtenidas exitosamente.", data: asociaciones });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};