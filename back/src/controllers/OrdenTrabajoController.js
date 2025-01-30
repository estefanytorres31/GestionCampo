import * as OrdenTrabajoService from "../services/OrdenTrabajoService.js";

export const asignarTrabajoAEmbarcacion = async (req, res) => {
  const {
    id_tipo_trabajo,
    id_embarcacion,
    id_puerto,
    id_jefe_asigna,
    codigo,
    comentarios,
    motorista,
    supervisor,
  } = req.body;

  try {
    const { mensaje, ordenTrabajo } =
      await OrdenTrabajoService.asignarTrabajoAEmbarcacion({
        id_tipo_trabajo,
        id_embarcacion,
        id_puerto,
        id_jefe_asigna,
        codigo,
        comentarios,
        motorista,
        supervisor,
      });

    res.status(201).json({
      message: mensaje,
      data: ordenTrabajo,
    });
  } catch (error) {
    if (error.message.includes("ya existe y está activa")) {
      return res.status(409).json({ message: error.message }); // 409: Conflicto
    }
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajo = async (req, res) => {
  try {
    const ordenesTrabajo = await OrdenTrabajoService.getAllOrdenesTrabajo();
    res.status(200).json({
      message: "Órdenes de trabajo obtenidas exitosamente.",
      data: ordenesTrabajo,
    });
  } catch (error) {
    if (error.message === "No hay órdenes de trabajo activas.") {
      return res.status(404).json({ message: error.message });
    }
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
 * 🔹 Actualizar una Orden de Trabajo
 */
export const actualizarOrdenTrabajo = async (req, res) => {
  const { id_orden_trabajo } = req.params;
  const data = req.body;

  try {
    const ordenTrabajoActualizada =
      await OrdenTrabajoService.actualizarOrdenTrabajo(id_orden_trabajo, data);

    res.status(200).json({
      message: "Orden de trabajo actualizada exitosamente.",
      data: ordenTrabajoActualizada,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
