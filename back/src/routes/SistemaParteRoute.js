import { Router } from "express";
import {
    createSistemaParte,
    getPartesBySistema,
    updateSistemaParte,
} from "../controllers/SistemaParteController.js";

const sistemaParteRouter = Router();

sistemaParteRouter.post("/", createSistemaParte);
sistemaParteRouter.get("/:id_sistema", getPartesBySistema);
sistemaParteRouter.put("/:id_sistema_parte", updateSistemaParte);

export default sistemaParteRouter;