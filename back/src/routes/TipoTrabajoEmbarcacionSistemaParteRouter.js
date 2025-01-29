import { Router } from "express";
import {
    createOrReactivateTipoTrabajoESP,
    getAllTipoTrabajoESP,
    getTipoTrabajoESPById,
    updateTipoTrabajoESP,
    desactivarTipoTrabajoESP
} from "../controllers/TipoTrabajoEmbarcacionSistemaParteController.js";

const tipoTrabajoESPRouter = Router();

// 📌 Crear o Reactivar una relación
tipoTrabajoESPRouter.post("/", createOrReactivateTipoTrabajoESP);

// 📌 Obtener todas las relaciones activas
tipoTrabajoESPRouter.get("/", getAllTipoTrabajoESP);

// 📌 Obtener una relación por su ID
tipoTrabajoESPRouter.get("/:id", getTipoTrabajoESPById);

// 📌 Actualizar una relación
tipoTrabajoESPRouter.put("/:id", updateTipoTrabajoESP);

// 📌 Desactivar una relación
tipoTrabajoESPRouter.delete("/:id", desactivarTipoTrabajoESP);

export default tipoTrabajoESPRouter;