import { Router } from "express";
import {
    assignRolToUsuario,
    removeRolFromUsuario,
    getRolesByUsuario,
    getUsuariosByRol
} from "../controllers/UsuarioRolController.js";

const usuarioRolRouter = Router();

// 📌 Asignar un rol a un usuario
usuarioRolRouter.post("/assign", assignRolToUsuario);

// 📌 Remover un rol de un usuario (desactivar)
usuarioRolRouter.put("/remove", removeRolFromUsuario);

// 📌 Obtener todos los roles de un usuario
usuarioRolRouter.get("/usuario/:usuario_id", getRolesByUsuario);

// 📌 Obtener todos los usuarios que tienen un rol específico
usuarioRolRouter.get("/rol/:rol_id", getUsuariosByRol);

export default usuarioRolRouter;
