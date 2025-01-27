// routes/HistorialPuertoRoute.js

import {
    createHistorialPuerto,
    getHistorialByEmbarcacion,
    getHistorialById,
    updateHistorialPuerto,
    deleteHistorialPuerto,
    getHistorialCompleto,
  } from "../controllers/HistorialPuertoController.js";
  import { Router } from "express";
  
  const historialPuertoRouter = Router();
  
  // Crear un nuevo historial de puerto
  historialPuertoRouter.post("/api/historial-puertos", createHistorialPuerto);
  
  // Obtener todos los historiales de una embarcación específica
  historialPuertoRouter.get("/api/historial-puertos/embarcacion/:embarcacionId", getHistorialByEmbarcacion);
  
  // Obtener un historial de puerto por ID
  historialPuertoRouter.get("/api/historial-puertos/:id", getHistorialById);
  
  // Actualizar un historial de puerto (e.g., agregar fecha de salida)
  historialPuertoRouter.put("/api/historial-puertos/:id", updateHistorialPuerto);
  
  // Eliminar (desactivar) un historial de puerto
  historialPuertoRouter.delete("/api/historial-puertos/:id", deleteHistorialPuerto);
  historialPuertoRouter.get("/api/historial-puertos/completo/:embarcacionId", getHistorialCompleto);
  
  export default historialPuertoRouter;
  