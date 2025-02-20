import {
  createPuerto,
  getAllPuertos,
  getPuertoById,
  updatePuerto,
  deletePuerto,
} from "../controllers/PuertoController.js";
import { Router } from "express";
import {verificarAuth } from "../middleware/verificarAuth.js"

const puertoRouter = Router();

// Rutas de la API de puertos
puertoRouter.post("/", createPuerto); // Crear puerto
puertoRouter.get("/", getAllPuertos); // Obtener todos los puertos
puertoRouter.get("/:id", getPuertoById); // Obtener puerto por ID
puertoRouter.put("/:id", updatePuerto); // Actualizar puerto
puertoRouter.delete("/:id", deletePuerto); // Desactivar puerto

export default puertoRouter;