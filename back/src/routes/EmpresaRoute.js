import {
  createEmpresa,
  getAllEmpresas,
  getEmpresaById,
  updateEmpresa,
  deleteEmpresa,
} from "../controllers/EmpresaController.js";
import { Router } from "express";
import {verificarAuth } from "../middleware/verificarAuth.js"

const empresaRouter = Router();

empresaRouter.post("/", createEmpresa);
empresaRouter.get("/", getAllEmpresas);
empresaRouter.get("/:id", getEmpresaById);
empresaRouter.put("/:id", updateEmpresa);
empresaRouter.delete("/:id", deleteEmpresa);

export default empresaRouter;
