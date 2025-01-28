// src/routes/RolesPermisoRouter.js
import {
    assignPermisoToRol,
    removePermisoFromRol,
    getPermisosByRol,
    getRolesByPermiso,
} from "../controllers/RolesPermisoController.js";
import { Router } from "express";

const rolesPermisoRouter = Router();

// Definir las rutas
rolesPermisoRouter.post("/assign", assignPermisoToRol);
rolesPermisoRouter.post("/remove", removePermisoFromRol);
rolesPermisoRouter.get("/permisos/:rol_id", getPermisosByRol);
rolesPermisoRouter.get("/roles/:permiso_id", getRolesByPermiso);

export default rolesPermisoRouter;
