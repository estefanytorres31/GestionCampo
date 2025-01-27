import {
    createPuerto,
    getAllPuertos,
    getPuertoById,
    updatePuerto,
    deletePuerto,
  } from "../controllers/PuertoController.js";
  import { Router } from "express";
  
  const puertoRouter = Router();
  
  puertoRouter.post("/api/puertos", createPuerto);
  puertoRouter.get("/api/puertos", getAllPuertos);
  puertoRouter.get("/api/puertos/:id", getPuertoById);
  puertoRouter.put("/api/puertos/:id", updatePuerto);
  puertoRouter.delete("/api/puertos/:id", deletePuerto);
  
  export default puertoRouter;
  