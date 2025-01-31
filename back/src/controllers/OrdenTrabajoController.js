import * as OrdenTrabajoService from "../services/OrdenTrabajoService.js";

/**
 * 🔹 Asignar un Trabajo a una Embarcación (Crear o Reactivar)
 */
export const asignarTrabajoAEmbarcacion = async (req, res) => {
  try {
    const resultado = await OrdenTrabajoService.asignarTrabajoAEmbarcacion(req.body);
    res.status(201).json({
      message: resultado.mensaje,
      data: resultado.ordenTrabajo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🔹 Actualizar una Orden de Trabajo
 */
export const actualizarOrdenTrabajo = async (req, res) => {
  const { id_orden_trabajo } = req.params;

  try {
    const ordenTrabajoActualizada = await OrdenTrabajoService.actualizarOrdenTrabajo(
      id_orden_trabajo,
      req.body
    );

    res.status(200).json({
      message: "Orden de trabajo actualizada exitosamente.",
      data: ordenTrabajoActualizada,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajo = async (req, res) => {
  try {
    const ordenesTrabajo = await OrdenTrabajoService.getAllOrdenesTrabajo();
    
    if (ordenesTrabajo.length === 0) {
      return res.status(200).json({
        message: "No se encontraron registros de órdenes de trabajo disponibles.",
        data: [],
      });
    }

    res.status(200).json({
      message: "Órdenes de trabajo obtenidas exitosamente.",
      data: ordenesTrabajo,
    });
  } catch (error) {
    // Aunque ahora el servicio no lanza un error por lista vacía,
    // se mantiene el manejo de otros posibles errores
    res.status(500).json({
      message: "Error al obtener las órdenes de trabajo.",
      error: error.message,
    });
  }
};

/**
 * Obtener una Orden de Trabajo Activa por su ID
 */
export const getOrdenTrabajoById = async (req, res) => {
  const { id_orden_trabajo } = req.params;

  try {
    const ordenTrabajo = await OrdenTrabajoService.getOrdenTrabajoById(
      id_orden_trabajo
    );
    res.status(200).json({
      message: "Orden de trabajo obtenida exitosamente.",
      data: ordenTrabajo,
    });
  } catch (error) {
    if (
      error.message.includes("no existe") ||
      error.message.includes("inactiva")
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({
      message: "Error al obtener la orden de trabajo.",
      error: error.message,
    });
  }
};

/**
 * 🔹 Desactivar (Inactivar) una Orden de Trabajo
 */
export const desactivarOrdenTrabajo = async (req, res) => {
  const { id_orden_trabajo } = req.params;

  try {
    const ordenTrabajoDesactivada =
      await OrdenTrabajoService.desactivarOrdenTrabajo(id_orden_trabajo);

    res.status(200).json({
      message: "Orden de trabajo desactivada exitosamente.",
      data: ordenTrabajoDesactivada,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
