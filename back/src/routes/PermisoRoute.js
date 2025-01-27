import {
    createPermiso,
    obtenerTodosLosPermisos,
    actualizarPermiso,
    eliminarPermiso,
    getPermisoById,
  } from "../controllers/PermisoController.js";
  import { Router } from "express";
  
  const permisoRouter = Router();
  
  permisoRouter.get("/api/permisos", obtenerTodosLosPermisos);
  permisoRouter.post("/api/permisos", createPermiso);
  permisoRouter.put("/api/permisos/:id", actualizarPermiso);
  permisoRouter.delete("/api/permisos/:id", eliminarPermiso);
  permisoRouter.get("/api/permisos/:id", getPermisoById);
  
  export default permisoRouter;
  