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
  historialPuertoRouter.post("/", createHistorialPuerto);
  
  // Obtener todos los historiales de una embarcación específica
  historialPuertoRouter.get("/embarcacion/:embarcacionId", getHistorialByEmbarcacion);
  
  // Obtener un historial de puerto por ID
  historialPuertoRouter.get("/:id", getHistorialById);
  
  // Actualizar un historial de puerto (e.g., agregar fecha de salida)
  historialPuertoRouter.put("/:id", updateHistorialPuerto);
  
  // Eliminar (desactivar) un historial de puerto
  historialPuertoRouter.delete("/:id", deleteHistorialPuerto);
  historialPuertoRouter.get("/completo/:embarcacionId", getHistorialCompleto);
  
  export default historialPuertoRouter;
  