import { Router } from "express";
import {
  createPermiso,
  getPermisoById,
  updatePermiso,
  deletePermiso,
  getAllPermisosController,
  getAllPermisosFilteredController,
} from "../controllers/PermisoController.js";

const permisoRouter = Router();

permisoRouter.post("/", createPermiso);
permisoRouter.get("/", getAllPermisosController);
permisoRouter.get("/ar", getAllPermisosFilteredController);
permisoRouter.get("/:id", getPermisoById);
permisoRouter.put("/:id", updatePermiso);
permisoRouter.delete("/:id", deletePermiso);

export default permisoRouter;
