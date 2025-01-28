import {
    createTipoTrabajo,
    getAllTipoTrabajos,
    getTipoTrabajoById,
    updateTipoTrabajo,
    deleteTipoTrabajo,
} from "../controllers/TipoTrabajoController.js";
import { Router } from "express";

const tipoTrabajoRouter = Router();

// Definir las rutas
tipoTrabajoRouter.post("/", createTipoTrabajo);
tipoTrabajoRouter.get("/", getAllTipoTrabajos);
tipoTrabajoRouter.get("/:id", getTipoTrabajoById);
tipoTrabajoRouter.put("/:id", updateTipoTrabajo);
tipoTrabajoRouter.delete("/:id", deleteTipoTrabajo);

export default tipoTrabajoRouter;