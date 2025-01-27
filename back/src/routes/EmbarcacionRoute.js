import {
    createEmbarcacion,
    getAllEmbarcaciones,
    getEmbarcacionById,
    updateEmbarcacion,
    deleteEmbarcacion,
  } from "../controllers/EmbarcacionController.js";
  import { Router } from "express";
  
  const embarcacionRouter = Router();
  
  embarcacionRouter.post("/api/embarcaciones", createEmbarcacion);
  embarcacionRouter.get("/api/embarcaciones", getAllEmbarcaciones);
  embarcacionRouter.get("/api/embarcaciones/:id", getEmbarcacionById);
  embarcacionRouter.put("/api/embarcaciones/:id", updateEmbarcacion);
  embarcacionRouter.delete("/api/embarcaciones/:id", deleteEmbarcacion);
  
  export default embarcacionRouter;
  