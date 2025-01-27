import {
    createUsuario,
    getUserByUsername,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
} from "../controllers/UsuarioController.js";
import { Router } from "express";

const usuarioRouter = Router();

usuarioRouter.get('/api/usuario', getAllUsers);
usuarioRouter.get('/api/usuario/:nombre_usuario', getUserByUsername);
usuarioRouter.post('/api/usuario', createUsuario);
usuarioRouter.get('/api/usuario/:id', getUserById);
usuarioRouter.put('/api/usuario/:id', updateUser);
usuarioRouter.delete('/api/usuario/:id', deleteUser);
