import * as AbordajeService from "../services/AbordajeService.js";

/**
 * Crea un nuevo registro de abordaje o reactiva uno inactivo existente.
 */
export const createAbordaje = async (req, res) => {
  try {
    const { id_orden_trabajo_usuario, fecha, motorista, supervisor, id_puerto } = req.body;
    const abordaje = await AbordajeService.createAbordaje({
      id_orden_trabajo_usuario,
      fecha,
      motorista,
      supervisor,
      id_puerto,
    });
    
    // Si las marcas de tiempo son iguales, se creó; de lo contrario, se reactivó.
    const mensaje = 
      abordaje.creado_en.getTime() === abordaje.actualizado_en.getTime()
        ? "Abordaje creado exitosamente."
        : "Abordaje reactivado exitosamente.";
    
    res.status(201).json({ message: mensaje, data: abordaje });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtiene todos los registros de abordaje activos.
 */
export const getAllAbordajes = async (req, res) => {
  try {
    const abordajes = await AbordajeService.getAllAbordajes();
    res.status(200).json({ message: "Registros de abordaje obtenidos exitosamente.", data: abordajes });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Obtiene todos los registros de abordaje activos.
 */
export const getAbordajesByOrdenTrabajoController = async (req, res) => {
  try {
    const abordajes = await AbordajeService.getAbordajesByOrdenTrabajo(req.params.id);
    res.status(200).json({ message: "Registros de abordaje obtenidos exitosamente.", data: abordajes });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Obtiene un registro de abordaje por su ID.
 */
export const getAbordajeById = async (req, res) => {
  const { id } = req.params;
  try {
    const abordaje = await AbordajeService.getAbordajeById(id);
    res.status(200).json({ message: "Abordaje obtenido exitosamente.", data: abordaje });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Obtiene un registro de abordaje por su ID.
 */
export const getAbordajeUserSistemParteByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const abordaje = await AbordajeService.getAbordajeUserSistemaParteById(id);
    res.status(200).json({ message: "Abordaje obtenido exitosamente.", data: abordaje });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Actualiza un registro de abordaje.
 */
export const updateAbordaje = async (req, res) => {
  const { id } = req.params;
  const { fecha, motorista, supervisor, id_puerto } = req.body;
  try {
    const abordajeActualizado = await AbordajeService.updateAbordaje(id, { fecha, motorista, supervisor, id_puerto });
    res.status(200).json({ message: "Abordaje actualizado exitosamente.", data: abordajeActualizado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Elimina (soft delete) un registro de abordaje.
 */
export const deleteAbordaje = async (req, res) => {
  const { id } = req.params;
  try {
    const abordajeEliminado = await AbordajeService.deleteAbordaje(id);
    res.status(200).json({ message: "Abordaje eliminado exitosamente.", data: abordajeEliminado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
