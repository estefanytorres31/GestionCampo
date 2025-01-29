import * as TipoTrabajoESPService from "../services/TipoTrabajoEmbarcacionSistemaParteService.js";

/**
 * Crear o Reactivar una relación TipoTrabajoEmbarcacionSistemaParte
 */
export const createOrReactivateTipoTrabajoESP = async (req, res) => {
    const { id_tipo_trabajo, id_embarcacion_sistema_parte } = req.body;

    try {
        const relacion = await TipoTrabajoESPService.createOrReactivateTipoTrabajoESP(id_tipo_trabajo, id_embarcacion_sistema_parte);
        const mensaje = relacion.creado_en.getTime() === relacion.actualizado_en.getTime()
            ? "Relación creada exitosamente."
            : "Relación reactivada exitosamente.";
        
        res.status(201).json({ message: mensaje, data: relacion });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener todas las relaciones activas
 */
export const getAllTipoTrabajoESP = async (req, res) => {
    try {
        const relaciones = await TipoTrabajoESPService.getAllTipoTrabajoESP();
        res.status(200).json({ message: "Relaciones obtenidas exitosamente.", data: relaciones });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Obtener una relación por su ID
 */
export const getTipoTrabajoESPById = async (req, res) => {
    const { id } = req.params;

    try {
        const relacion = await TipoTrabajoESPService.getTipoTrabajoESPById(id);
        res.status(200).json({ message: "Relación obtenida exitosamente.", data: relacion });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Actualizar una relación TipoTrabajoEmbarcacionSistemaParte
 */
export const updateTipoTrabajoESP = async (req, res) => {
    const { id } = req.params;
    const data = req.body; // Puede incluir campos como id_tipo_trabajo, id_embarcacion_sistema_parte, etc.

    try {
        const relacionActualizada = await TipoTrabajoESPService.updateTipoTrabajoESP(id, data);
        res.status(200).json({ message: "Relación actualizada exitosamente.", data: relacionActualizada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

/**
 * Desactivar una relación TipoTrabajoEmbarcacionSistemaParte
 */
export const desactivarTipoTrabajoESP = async (req, res) => {
    const { id } = req.params;

    try {
        const relacionDesactivada = await TipoTrabajoESPService.desactivarTipoTrabajoESP(id);
        res.status(200).json({ message: "Relación desactivada exitosamente.", data: relacionDesactivada });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};