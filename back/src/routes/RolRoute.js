import {
  createRol,
  updateRol,
  deleteRol,
  getRolById,
  getAllRolesController,
} from "../controllers/RolController.js";
import { Router } from "express";

const rolRouter = Router();

rolRouter.get("/", getAllRolesController);
rolRouter.post("/", createRol);
rolRouter.put("/:id", updateRol);
rolRouter.delete("/:id", deleteRol);
rolRouter.get("/:id", getRolById);

export default rolRouter;
