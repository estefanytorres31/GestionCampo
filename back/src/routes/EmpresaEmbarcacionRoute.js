import {
    assignEmpresaToEmbarcacion,
    getEmbarcacionesByEmpresa,
    unassignEmpresaFromEmbarcacion,
    updateFechaAsignacion,
  } from "../controllers/EmpresaEmbarcacionController.js";
  import { Router } from "express";
  
  const empresaEmbarcacionRouter = Router();
  
  // Asignar una empresa a una embarcación
  empresaEmbarcacionRouter.post("/api/empresa-embarcaciones", assignEmpresaToEmbarcacion);
  
  // Obtener todas las embarcaciones asignadas a una empresa específica
  empresaEmbarcacionRouter.get("/api/empresa-embarcaciones/:empresaId", getEmbarcacionesByEmpresa);
  
  // Desasignar una empresa de una embarcación
  empresaEmbarcacionRouter.delete("/api/empresa-embarcaciones/:empresaId/:embarcacionId", unassignEmpresaFromEmbarcacion);
  empresaEmbarcacionRouter.put("/api/empresa-embarcaciones/:empresaId/:embarcacionId", updateFechaAsignacion);
  
  export default empresaEmbarcacionRouter;
  