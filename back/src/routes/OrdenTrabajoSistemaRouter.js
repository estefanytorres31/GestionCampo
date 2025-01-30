import {
    createOrdenTrabajoSistema,
    getAllOrdenesTrabajoSistema,
    getOrdenTrabajoSistemaById,
    deleteOrdenTrabajoSistema,
} from "../controllers/OrdenTrabajoSistemaController.js";
import { Router } from "express";

const ordenTrabajoSistemaRouter = Router();

ordenTrabajoSistemaRouter.post("/", createOrdenTrabajoSistema);
ordenTrabajoSistemaRouter.get("/", getAllOrdenesTrabajoSistema);
ordenTrabajoSistemaRouter.get("/:id", getOrdenTrabajoSistemaById);
ordenTrabajoSistemaRouter.delete("/:id", deleteOrdenTrabajoSistema);

export default ordenTrabajoSistemaRouter;
