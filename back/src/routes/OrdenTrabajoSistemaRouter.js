import { Router } from "express";
import {
    createOrdenTrabajoSistema,
    getAllOrdenesTrabajoSistema,
    getOrdenTrabajoSistemaById,
    updateOrdenTrabajoSistema,
    updateEstadoOrdenTrabajoSistema,
    deleteOrdenTrabajoSistema,
    getSistemasYPartesPorOrdenTrabajo
} from "../controllers/OrdenTrabajoSistemaController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const ordenTrabajoSistemaRouter = Router();

// Definir las rutas
ordenTrabajoSistemaRouter.post("/", createOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.get("/", getAllOrdenesTrabajoSistema);
ordenTrabajoSistemaRouter.get("/:id", getOrdenTrabajoSistemaById);
ordenTrabajoSistemaRouter.put("/:id", updateOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.put("/:id/estado", updateEstadoOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.delete("/:id", deleteOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.get("/:id_orden_trabajo/sistemas-partes", getSistemasYPartesPorOrdenTrabajo);


export default ordenTrabajoSistemaRouter;
