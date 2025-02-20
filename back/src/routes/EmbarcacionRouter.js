import {
    createEmbarcacion,
    getAllEmbarcaciones,
    getEmbarcacionById,
    updateEmbarcacion,
    deleteEmbarcacion,
    getEmbarcacionesByEmpresa
  } from "../controllers/EmbarcacionController.js";
  import { Router } from "express";
  import {verificarAuth } from "../middleware/verificarAuth.js"
  
  const embarcacionRouter = Router();
  
  embarcacionRouter.post("/", createEmbarcacion);
  embarcacionRouter.get("/", getAllEmbarcaciones);
  embarcacionRouter.get("/:id", getEmbarcacionById);
  embarcacionRouter.put("/:id", updateEmbarcacion);
  embarcacionRouter.delete("/:id", deleteEmbarcacion);
  embarcacionRouter.get("/empresa/:empresa_id", getEmbarcacionesByEmpresa);
  
  export default embarcacionRouter;
  