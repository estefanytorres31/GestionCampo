import { Router } from "express";
import {
    createParte,
    getAllPartes,
    getParteById,
    updateParte,
    deleteParte
} from "../controllers/ParteController.js";

const parteRouter = Router();

// 📌 Crear o reactivar una parte
parteRouter.post("/", createParte);

// 📌 Obtener todas las partes activas
parteRouter.get("/", getAllPartes);

// 📌 Obtener una parte por su ID
parteRouter.get("/:id", getParteById);

// 📌 Actualizar una parte existente
parteRouter.put("/:id_parte", updateParte);

// 📌 Desactivar una parte
parteRouter.delete("/:id_parte", deleteParte);

export default parteRouter;