import { createRol, getAllRoles, updateRol, deleteRol, getRolById } from "../controllers/RolController.js";
import {Router} from "express";

const rolRouter = Router();

rolRouter.get('/', getAllRoles)
rolRouter.post('/', createRol)
rolRouter.put('/:id', updateRol)
rolRouter.delete('/:id', deleteRol)
rolRouter.get('/:id', getRolById)

export default rolRouter;