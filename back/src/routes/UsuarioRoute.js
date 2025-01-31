import {
    createUsuario,
    getUserByUsername,
    getUserById,
    deleteUser,
    updateUser,
    getFilteredUsers,
    getAllUsers
} from "../controllers/UsuarioController.js";
import { Router } from "express";
import {verificarAuth, isAdmin } from "../middleware/verificarAuth.js"

const usuarioRouter = Router();

usuarioRouter.get('/', verificarAuth, getFilteredUsers);
usuarioRouter.get('/all', verificarAuth, isAdmin, getAllUsers);
usuarioRouter.get('/nombre/:nombre_usuario', getUserByUsername);
usuarioRouter.post('/', createUsuario);
usuarioRouter.get('/:id', getUserById);
usuarioRouter.put('/:id', updateUser);
usuarioRouter.delete('/:id', deleteUser);

export default usuarioRouter;