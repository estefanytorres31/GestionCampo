import * as OrdenTrabajoService from "../services/OrdenTrabajoService.js";

/**
 * 🔹 Asignar un Trabajo a una Embarcación (Crear o Reactivar)
 */
export const asignarTrabajoAEmbarcacion = async (req, res) => {
  try {
    const resultado = await OrdenTrabajoService.asignarTrabajoAEmbarcacion(req.body);
    res.status(201).json({ message: resultado.mensaje, data: resultado.ordenTrabajo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🔹 Actualizar una Orden de Trabajo
 */
export const actualizarOrdenTrabajo = async (req, res) => {
  try {
    const ordenTrabajoActualizada = await OrdenTrabajoService.actualizarOrdenTrabajo(req.params.id_orden_trabajo, req.body);
    res.status(200).json({ message: "Orden de trabajo actualizada exitosamente.", data: ordenTrabajoActualizada });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🔹 Obtener todas las órdenes de trabajo activas con filtros opcionales
 */
export const getAllOrdenesTrabajo = async (req, res) => {
  try {
      const ordenesTrabajo = await OrdenTrabajoService.getAllOrdenesTrabajo(req.query);
      res.status(200).json({
          message: "Órdenes de trabajo obtenidas exitosamente.",
          data: ordenesTrabajo,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener una Orden de Trabajo por ID
 */
export const getOrdenTrabajoById = async (req, res) => {
  try {
    const ordenTrabajo = await OrdenTrabajoService.getOrdenTrabajoById(req.params.id_orden_trabajo);
    res.status(200).json({ message: "Orden de trabajo obtenida exitosamente.", data: ordenTrabajo });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * 🔹 Desactivar una Orden de Trabajo
 */
export const desactivarOrdenTrabajo = async (req, res) => {
  try {
    const ordenTrabajoDesactivada = await OrdenTrabajoService.desactivarOrdenTrabajo(req.params.id_orden_trabajo);
    res.status(200).json({ message: "Orden de trabajo desactivada exitosamente.", data: ordenTrabajoDesactivada });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
