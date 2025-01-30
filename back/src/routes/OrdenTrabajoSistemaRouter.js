import { Router } from "express";
import {
    createOrdenTrabajoSistema,
    getAllOrdenesTrabajoSistema,
    getOrdenTrabajoSistemaById,
    updateOrdenTrabajoSistema
} from "../controllers/OrdenTrabajoSistemaController.js";

const ordenTrabajoSistemaRouter = Router();

ordenTrabajoSistemaRouter.post("/", createOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.get("/", getAllOrdenesTrabajoSistema);
ordenTrabajoSistemaRouter.get("/:id", getOrdenTrabajoSistemaById);
ordenTrabajoSistemaRouter.put("/:id", updateOrdenTrabajoSistema);

export default ordenTrabajoSistemaRouter;
