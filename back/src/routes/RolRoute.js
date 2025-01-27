import { createRol, obtenerTodosLosRoles, actualizarRol, eliminarRol, getRolById } from "../controllers/RolController.js";
import {Router} from "express";

const rolRouter = Router();

rolRouter.get('/api/rol', obtenerTodosLosRoles)
rolRouter.post('/api/rol', createRol)
rolRouter.put('/api/rol/:id', actualizarRol)
rolRouter.delete('/api/rol/:id', eliminarRol)
rolRouter.get('/api/rol/:id', getRolById)

export default rolRouter;