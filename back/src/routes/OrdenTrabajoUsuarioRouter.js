import {
    createOrdenTrabajoUsuario,
    getAllOrdenTrabajoUsuarios,
    getOrdenTrabajoUsuarioById,
    deleteOrdenTrabajoUsuario,
    updateOrdenTrabajoUsuario
} from "../controllers/OrdenTrabajoUsuarioController.js";
import { Router } from "express";

const ordenTrabajoUsuarioRouter = Router();

// Definir las rutas
ordenTrabajoUsuarioRouter.post("/", createOrdenTrabajoUsuario);
ordenTrabajoUsuarioRouter.put("/:id", updateOrdenTrabajoUsuario);
ordenTrabajoUsuarioRouter.get("/", getAllOrdenTrabajoUsuarios);
ordenTrabajoUsuarioRouter.get("/:id", getOrdenTrabajoUsuarioById);
ordenTrabajoUsuarioRouter.delete("/:id", deleteOrdenTrabajoUsuario);

export default ordenTrabajoUsuarioRouter;
