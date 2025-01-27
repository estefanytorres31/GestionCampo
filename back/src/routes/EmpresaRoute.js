import {
  createEmpresa,
  getAllEmpresas,
  getEmpresaById,
  updateEmpresa,
  deleteEmpresa,
} from "../controllers/EmpresaController.js";
import { Router } from "express";

const empresaRouter = Router();

empresaRouter.post("/api/empresas", createEmpresa);
empresaRouter.get("/api/empresas", getAllEmpresas);
empresaRouter.get("/api/empresas/:id", getEmpresaById);
empresaRouter.put("/api/empresas/:id", updateEmpresa);
empresaRouter.delete("/api/empresas/:id", deleteEmpresa);

export default empresaRouter;
