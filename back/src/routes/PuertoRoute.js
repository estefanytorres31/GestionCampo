import {
  createPuerto,
  getAllPuertos,
  getPuertoById,
  updatePuerto,
  deletePuerto,
} from "../controllers/PuertoController.js";
import { Router } from "express";

const puertoRouter = Router();

puertoRouter.post("/", createPuerto);
puertoRouter.get("/", getAllPuertos);
puertoRouter.get("/:id", getPuertoById);
puertoRouter.put("/:id", updatePuerto);
puertoRouter.delete("/:id", deletePuerto);

export default puertoRouter;
