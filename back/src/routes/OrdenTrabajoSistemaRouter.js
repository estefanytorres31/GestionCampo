import { Router } from "express";
import {
    createOrdenTrabajoSistema,
    getAllOrdenesTrabajoSistema,
    getOrdenTrabajoSistemaById,
    updateOrdenTrabajoSistema,
    deleteOrdenTrabajoSistema
} from "../controllers/OrdenTrabajoSistemaController.js";

const ordenTrabajoSistemaRouter = Router();

// Definir las rutas
ordenTrabajoSistemaRouter.post("/", createOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.get("/", getAllOrdenesTrabajoSistema);
ordenTrabajoSistemaRouter.get("/:id", getOrdenTrabajoSistemaById);
ordenTrabajoSistemaRouter.put("/:id", updateOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.delete("/:id", deleteOrdenTrabajoSistema);

export default ordenTrabajoSistemaRouter;
