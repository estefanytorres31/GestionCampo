import {
    createUsuario,
    getUserByUsername,
    getUserById,
    deleteUser,
    updateUser,
    getUsersController
} from "../controllers/UsuarioController.js";
import { Router } from "express";
import {verificarAuth } from "../middleware/verificarAuth.js"

const usuarioRouter = Router();

// usuarioRouter.get('/', verificarAuth, getFilteredUsers);
usuarioRouter.get('/', getUsersController);
usuarioRouter.get('/nombre/:nombre_usuario', getUserByUsername);
usuarioRouter.post('/', createUsuario);
usuarioRouter.get('/:id', getUserById);
usuarioRouter.put('/:id', updateUser);
usuarioRouter.delete('/:id', deleteUser);

export default usuarioRouter;