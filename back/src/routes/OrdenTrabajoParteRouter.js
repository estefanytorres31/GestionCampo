import { Router } from "express";
import {
    createOrdenTrabajoParte,
    getAllOrdenesTrabajoParte,
    getOrdenTrabajoParteById,
    updateOrdenTrabajoParte,
    deleteOrdenTrabajoParte
} from "../controllers/OrdenTrabajoParteController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const ordenTrabajoParteRouter = Router();

// Definir las rutas
ordenTrabajoParteRouter.post("/", createOrdenTrabajoParte);
ordenTrabajoParteRouter.get("/", getAllOrdenesTrabajoParte);
ordenTrabajoParteRouter.get("/:id", getOrdenTrabajoParteById);
ordenTrabajoParteRouter.put("/:id", updateOrdenTrabajoParte);
ordenTrabajoParteRouter.delete("/:id", deleteOrdenTrabajoParte);

export default ordenTrabajoParteRouter;
