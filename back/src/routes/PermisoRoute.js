import {
    createPermiso,
    obtenerTodosLosPermisos,
    actualizarPermiso,
    eliminarPermiso,
    getPermisoById,
  } from "../controllers/PermisoController.js";
  import { Router } from "express";
  
  const permisoRouter = Router();
  
  permisoRouter.get("/", obtenerTodosLosPermisos);
  permisoRouter.post("/", createPermiso);
  permisoRouter.put("/:id", actualizarPermiso);
  permisoRouter.delete("/:id", eliminarPermiso);
  permisoRouter.get("/:id", getPermisoById);
  
  export default permisoRouter;
  