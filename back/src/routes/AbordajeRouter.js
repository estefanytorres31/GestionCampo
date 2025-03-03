import { Router } from "express";
import {
  createAbordaje,
  getAllAbordajes,
  getAbordajeById,
  updateAbordaje,
  deleteAbordaje,
  getAbordajeUserSistemParteByIdController,
  getAbordajesByOrdenTrabajoController,
} from "../controllers/AbordajeController.js";

const abordajeRouter = Router();

abordajeRouter.post("/", createAbordaje);
abordajeRouter.get("/", getAllAbordajes);
abordajeRouter.get("/orden-trabajo/:id", getAbordajesByOrdenTrabajoController);
abordajeRouter.get("/:id", getAbordajeById);
abordajeRouter.get("/detalle/:id", getAbordajeUserSistemParteByIdController);
abordajeRouter.put("/:id", updateAbordaje);
abordajeRouter.delete("/:id", deleteAbordaje);

export default abordajeRouter;
