// src/routes/PermisoRouter.js
import {
  createPermiso,
  getAllPermisos,
  getPermisoById,
  updatePermiso,
  deletePermiso,
} from "../controllers/PermisoController.js";
import { Router } from "express";

const permisoRouter = Router();

// Definir las rutas
permisoRouter.post("/", createPermiso);
permisoRouter.get("/", getAllPermisos);
permisoRouter.get("/:id", getPermisoById);
permisoRouter.put("/:id", updatePermiso);
permisoRouter.delete("/:id", deletePermiso);

export default permisoRouter;
