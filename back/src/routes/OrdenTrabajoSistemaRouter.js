import {
    assignSistemaToOrdenTrabajo,
    modificarAsignacionSistema,
    deactivateSistemaFromOrdenTrabajo,
    getSistemasByOrdenTrabajo,
    generarReporteOrdenesTrabajoConSistemas,
    finalizarOrdenTrabajo,
    reasignarOrdenTrabajoAUsuarios,
} from "../controllers/OrdenTrabajoSistemaController.js";

import { Router } from "express";

const ordenTrabajoSistemaRouter = Router();

// Asignar un Sistema a una Orden de Trabajo
ordenTrabajoSistemaRouter.post("/assign", assignSistemaToOrdenTrabajo);

// Modificar la Asignación de Sistemas a una Orden de Trabajo
ordenTrabajoSistemaRouter.put("/modificar/:id_orden_trabajo_sistema", modificarAsignacionSistema);

// Desactivar un Sistema de una Orden de Trabajo
ordenTrabajoSistemaRouter.post("/deactivate", deactivateSistemaFromOrdenTrabajo);

// Visualizar Sistemas Asignados a una Orden de Trabajo
ordenTrabajoSistemaRouter.get("/orden/:id_orden_trabajo", getSistemasByOrdenTrabajo);

// Generar Reportes de Ordenes de Trabajo con Sistemas
ordenTrabajoSistemaRouter.get("/report", generarReporteOrdenesTrabajoConSistemas);

// Finalizar una Orden de Trabajo y Actualizar Estados
ordenTrabajoSistemaRouter.put("/finalizar/:id_orden_trabajo", finalizarOrdenTrabajo);

// Reasignar una Orden de Trabajo a Otros Usuarios
ordenTrabajoSistemaRouter.post("/reasignar-usuarios", reasignarOrdenTrabajoAUsuarios);

export default ordenTrabajoSistemaRouter;