import {
    asignarTrabajoAEmbarcacion,
    gestionarEstadoOrdenTrabajo,
    actualizarEstadoOrdenTrabajo,
    asignarMultipleOrdenesTrabajoAEmbarcacion,
} from "../controllers/OrdenTrabajoController.js";
import { Router } from "express";

const ordenTrabajoRouter = Router();

ordenTrabajoRouter.post("/asignar", asignarTrabajoAEmbarcacion);
ordenTrabajoRouter.post("/asignar-multiple", asignarMultipleOrdenesTrabajoAEmbarcacion);
ordenTrabajoRouter.post("/gestionar-estado", gestionarEstadoOrdenTrabajo);
ordenTrabajoRouter.put("/:id_orden_trabajo/estado", actualizarEstadoOrdenTrabajo);

export default ordenTrabajoRouter;