import {
    createEmbarcacion,
    getAllEmbarcaciones,
    getEmbarcacionById,
    updateEmbarcacion,
    deleteEmbarcacion,
  } from "../controllers/EmbarcacionController.js";
  import { Router } from "express";
  
  const embarcacionRouter = Router();
  
  embarcacionRouter.post("/", createEmbarcacion);
  embarcacionRouter.get("/", getAllEmbarcaciones);
  embarcacionRouter.get("/:id", getEmbarcacionById);
  embarcacionRouter.put("/:id", updateEmbarcacion);
  embarcacionRouter.delete("/:id", deleteEmbarcacion);
  
  export default embarcacionRouter;
  