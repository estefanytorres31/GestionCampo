import { Router } from "express";
import {
    assignRolToUsuario,
    removeRolFromUsuario,
    getRolesByUsuario,
    getUsuariosByRol,
    assignMultipleRolesToUsuario
} from "../controllers/UsuarioRolController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const usuarioRolRouter = Router();

// 📌 Asignar un rol a un usuario
usuarioRolRouter.post("/assign", assignRolToUsuario);

// 📌 Remover un rol de un usuario (desactivar)
usuarioRolRouter.put("/remove", removeRolFromUsuario);

// 📌 Asignar múltiples roles a un usuario
usuarioRolRouter.post("/assign-multiple-roles", assignMultipleRolesToUsuario);

// 📌 Obtener todos los roles de un usuario
usuarioRolRouter.get("/usuario/:usuario_id", getRolesByUsuario);

// 📌 Obtener todos los usuarios que tienen un rol específico
usuarioRolRouter.get("/rol/:rol_id", getUsuariosByRol);

export default usuarioRolRouter;
