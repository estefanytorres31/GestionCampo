import { createRol, obtenerTodosLosRoles, actualizarRol, eliminarRol, getRolById } from "../controllers/RolController.js";
import {Router} from "express";

const rolRouter = Router();

rolRouter.get('/', obtenerTodosLosRoles)
rolRouter.post('/', createRol)
rolRouter.put('/:id', actualizarRol)
rolRouter.delete('/:id', eliminarRol)
rolRouter.get('/:id', getRolById)

export default rolRouter;