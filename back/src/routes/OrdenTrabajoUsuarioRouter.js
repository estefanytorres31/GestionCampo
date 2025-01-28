
import {
    assignUserToOrdenTrabajo,
    getUsuariosByOrdenTrabajo,
    getAsignacionById,
    updateAsignacion,
    removeAsignacion,
    reasignarOrdenTrabajo,
    generarReporteOrdenesTrabajo,
    generarInformeProductividad,
} from "../controllers/OrdenTrabajoUsuarioController.js";

import { Router } from "express";

const ordenTrabajoUsuarioRouter = Router();

// Asignar un Usuario a una Orden de Trabajo
ordenTrabajoUsuarioRouter.post("/assign", assignUserToOrdenTrabajo);

// Obtener todos los Usuarios asignados a una Orden de Trabajo
ordenTrabajoUsuarioRouter.get("/orden/:id_orden_trabajo", getUsuariosByOrdenTrabajo);

// Obtener una Asignación por su ID
ordenTrabajoUsuarioRouter.get("/:id_orden_trabajo_usuario", getAsignacionById);

// Actualizar una Asignación
ordenTrabajoUsuarioRouter.put("/:id_orden_trabajo_usuario", updateAsignacion);

// Eliminar una Asignación
ordenTrabajoUsuarioRouter.delete("/:id_orden_trabajo_usuario", removeAsignacion);

// Reasignar una Orden de Trabajo a Otros Usuarios
ordenTrabajoUsuarioRouter.post("/reasignar", reasignarOrdenTrabajo);

// Generar Reportes de Órdenes de Trabajo
ordenTrabajoUsuarioRouter.get("/report", generarReporteOrdenesTrabajo);

// Generar Informes de Productividad por Usuario Técnico
ordenTrabajoUsuarioRouter.get("/productividad", generarInformeProductividad);

export default ordenTrabajoUsuarioRouter;