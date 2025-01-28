import {
    assignEmpresaToEmbarcacion,
    getEmbarcacionesByEmpresa,
    unassignEmpresaFromEmbarcacion,
    updateFechaAsignacion,
  } from "../controllers/EmpresaEmbarcacionController.js";
  import { Router } from "express";
  
  const empresaEmbarcacionRouter = Router();
  
  // Asignar una empresa a una embarcación
  empresaEmbarcacionRouter.post("/", assignEmpresaToEmbarcacion);
  
  // Obtener todas las embarcaciones asignadas a una empresa específica
  empresaEmbarcacionRouter.get("/:empresaId", getEmbarcacionesByEmpresa);
  
  // Desasignar una empresa de una embarcación
  empresaEmbarcacionRouter.delete("/:empresaId/:embarcacionId", unassignEmpresaFromEmbarcacion);
  empresaEmbarcacionRouter.put("/:empresaId/:embarcacionId", updateFechaAsignacion);
  
  export default empresaEmbarcacionRouter;
  