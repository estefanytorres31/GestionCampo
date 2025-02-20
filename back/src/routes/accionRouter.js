import { Router } from "express";
import {
  createAccion,
  getAllAcciones,
  getAccionById,
  updateAccion,
  deleteAccion,
  seedAcciones
} from "../controllers/AccionController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const accionRouter = Router();

accionRouter.post("/seedAcciones", seedAcciones);
accionRouter.post("/", createAccion);
accionRouter.get("/", getAllAcciones);
accionRouter.get("/:id", getAccionById);
accionRouter.put("/:id", updateAccion);
accionRouter.delete("/:id", deleteAccion);

export default accionRouter;
