// routes/ordenTrabajo.js

import { Router } from "express";
import {
    actualizarOrdenTrabajo,
  asignarTrabajoAEmbarcacion,
  desactivarOrdenTrabajo,
  getAllOrdenesTrabajo,
  getAllOrdenesTrabajoWeb,
  getOrdenTrabajoById,
  getOrdenTrabajoByEmpresa
} from "../controllers/OrdenTrabajoController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const ordenTrabajoRouter = Router();

// 📌 Crear una nueva Orden de Trabajo (Crear o Reactivar)
ordenTrabajoRouter.post("/", asignarTrabajoAEmbarcacion);

// 📌 Obtener todas las Ordenes de Trabajo Activas con filtrado y paginación
ordenTrabajoRouter.get("/", getAllOrdenesTrabajo);

ordenTrabajoRouter.get("/web", getAllOrdenesTrabajoWeb);

// 📌 Obtener una Orden de Trabajo Activa por ID
ordenTrabajoRouter.get("/:id_orden_trabajo", getOrdenTrabajoById);

// 📌 Actualizar una Orden de Trabajo
ordenTrabajoRouter.put("/:id_orden_trabajo", actualizarOrdenTrabajo);

// 📌 Desactivar (Inactivar) una Orden de Trabajo
ordenTrabajoRouter.delete("/:id_orden_trabajo", desactivarOrdenTrabajo);

// �� Obtener todas las Ordenes de Trabajo de una Empresa
ordenTrabajoRouter.get("/empresa/:id_empresa", getOrdenTrabajoByEmpresa);

export default ordenTrabajoRouter;
