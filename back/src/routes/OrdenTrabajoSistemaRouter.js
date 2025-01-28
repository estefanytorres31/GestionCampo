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

ordenTrabajoSistemaRouter.post("/assign", assignSistemaToOrdenTrabajo);
ordenTrabajoSistemaRouter.put("/modificar/:id_orden_trabajo_sistema", modificarAsignacionSistema);
ordenTrabajoSistemaRouter.post("/deactivate", deactivateSistemaFromOrdenTrabajo);
ordenTrabajoSistemaRouter.get("/orden/:id_orden_trabajo", getSistemasByOrdenTrabajo);
ordenTrabajoSistemaRouter.get("/report", generarReporteOrdenesTrabajoConSistemas);
ordenTrabajoSistemaRouter.put("/finalizar/:id_orden_trabajo", finalizarOrdenTrabajo);
ordenTrabajoSistemaRouter.post("/reasignar-usuarios", reasignarOrdenTrabajoAUsuarios);

export default ordenTrabajoSistemaRouter;
