import { Router } from "express";
import {
    asignarTrabajoAEmbarcacion,
    gestionarEstadoOrdenTrabajo,
    actualizarEstadoOrdenTrabajo,
    asignarMultipleOrdenesTrabajoAEmbarcacion,
} from "../controllers/OrdenTrabajoController.js";

const ordenTrabajoRouter = Router();

// 📌 Asignar un Trabajo a una Embarcación
ordenTrabajoRouter.post("/asignar", asignarTrabajoAEmbarcacion);

// 📌 Gestionar el Estado de la Orden de Trabajo
ordenTrabajoRouter.post("/gestionarestado", gestionarEstadoOrdenTrabajo);

// 📌 Actualizar el Estado de la Orden de Trabajo
ordenTrabajoRouter.put("/actualizarestado/:id_orden_trabajo", actualizarEstadoOrdenTrabajo);

// 📌 Asignar múltiples Ordenes de Trabajo a una Embarcación
ordenTrabajoRouter.post("/asignarmultiples", asignarMultipleOrdenesTrabajoAEmbarcacion);

export default ordenTrabajoRouter;
