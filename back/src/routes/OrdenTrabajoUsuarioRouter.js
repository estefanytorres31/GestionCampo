
import {
    assignUserToOrdenTrabajo,
    getUsuariosByOrdenTrabajo,
    getAsignacionById,
    updateAsignacion,
    removeAsignacion,
    reasignarOrdenTrabajo,
    generarReporteOrdenesTrabajo,
} from "../controllers/OrdenTrabajoUsuarioController.js";

import { Router } from "express";

const ordenTrabajoUsuarioRouter = Router();

ordenTrabajoUsuarioRouter.post("/assign", assignUserToOrdenTrabajo);
ordenTrabajoUsuarioRouter.get("/orden/:id_orden_trabajo", getUsuariosByOrdenTrabajo);
ordenTrabajoUsuarioRouter.get("/:id_orden_trabajo_usuario", getAsignacionById);
ordenTrabajoUsuarioRouter.put("/:id_orden_trabajo_usuario", updateAsignacion);
ordenTrabajoUsuarioRouter.delete("/:id_orden_trabajo_usuario", removeAsignacion);
ordenTrabajoUsuarioRouter.post("/reasignar", reasignarOrdenTrabajo);
ordenTrabajoUsuarioRouter.get("/report", generarReporteOrdenesTrabajo);

export default ordenTrabajoUsuarioRouter;