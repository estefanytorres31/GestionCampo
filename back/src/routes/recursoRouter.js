import { Router } from "express";
import {
  createRecurso,
  getRecursoById,
  updateRecurso,
  deleteRecurso,
  seedResources,
  getAllRecursosController
} from "../controllers/RecursoController.js";

const recursoRouter = Router();

recursoRouter.post("/seedResources", seedResources);
recursoRouter.post("/", createRecurso);
recursoRouter.get("/", getAllRecursosController);
recursoRouter.get("/:id", getRecursoById);
recursoRouter.put("/:id", updateRecurso);
recursoRouter.delete("/:id", deleteRecurso);

export default recursoRouter;
