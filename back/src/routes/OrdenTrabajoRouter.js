// routes/ordenTrabajo.js

import { Router } from "express";
import {
    actualizarOrdenTrabajo,
  asignarTrabajoAEmbarcacion,
  desactivarOrdenTrabajo,
  getAllOrdenesTrabajo,
  getOrdenTrabajoById,
} from "../controllers/OrdenTrabajoController.js";

const ordenTrabajoRouter = Router();

// 📌 Crear una nueva Orden de Trabajo (Crear o Reactivar)
ordenTrabajoRouter.post("/", asignarTrabajoAEmbarcacion);

// 📌 Obtener todas las Ordenes de Trabajo Activas con filtrado y paginación
ordenTrabajoRouter.get("/", getAllOrdenesTrabajo);

// 📌 Obtener una Orden de Trabajo Activa por ID
ordenTrabajoRouter.get("/:id_orden_trabajo", getOrdenTrabajoById);

// 📌 Actualizar una Orden de Trabajo
ordenTrabajoRouter.put("/:id_orden_trabajo", actualizarOrdenTrabajo);

// 📌 Desactivar (Inactivar) una Orden de Trabajo
ordenTrabajoRouter.delete("/:id_orden_trabajo", desactivarOrdenTrabajo);

export default ordenTrabajoRouter;
