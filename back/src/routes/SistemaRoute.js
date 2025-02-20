import {
    createSistema,
    getAllSistemas,
    getSistemaById,
    updateSistema,
    deleteSistema,
} from "../controllers/SistemaController.js";
import { Router } from "express";
import {verificarAuth } from "../middleware/verificarAuth.js"

const sistemaRouter = Router();

// Definir las rutas
sistemaRouter.post("/", createSistema);
sistemaRouter.get("/", getAllSistemas);
sistemaRouter.get("/:id", getSistemaById);
sistemaRouter.put("/:id", updateSistema);
sistemaRouter.delete("/:id", deleteSistema);

export default sistemaRouter;
