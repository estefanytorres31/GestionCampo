// src/routes/PermisoRouter.js
import {
  createPermiso,
  getPermisoById,
  updatePermiso,
  deletePermiso,
  getAllPermisosController,
} from "../controllers/PermisoController.js";
import { Router } from "express";

const permisoRouter = Router();

// Definir las rutas
permisoRouter.post("/", createPermiso);
permisoRouter.get("/", getAllPermisosController);
permisoRouter.get("/:id", getPermisoById);
permisoRouter.put("/:id", updatePermiso);
permisoRouter.delete("/:id", deletePermiso);

export default permisoRouter;