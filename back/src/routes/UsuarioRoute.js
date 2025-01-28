import {
    createUsuario,
    getUserByUsername,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
} from "../controllers/UsuarioController.js";
import { Router } from "express";
import {verificarAuth } from "../middleware/verificarAuth.js"

const usuarioRouter = Router();

usuarioRouter.get('/api/usuario', verificarAuth, getAllUsers);
usuarioRouter.get('/api/usuario/nombre/:nombre_usuario', getUserByUsername);
usuarioRouter.post('/api/usuario', createUsuario);
usuarioRouter.get('/api/usuario/:id', getUserById);
usuarioRouter.put('/api/usuario/:id', updateUser);
usuarioRouter.delete('/api/usuario/:id', deleteUser);

export default usuarioRouter;