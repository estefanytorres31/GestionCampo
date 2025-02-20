// routes/SistemaParteRouter.js
import { Router } from "express";
import {
    assignSistemaParte,
    getPartesBySistema,
    updateSistemaParte,
    deleteSistemaParte,
    reactivateSistemaParte,
    getAllSistemasWithPartes
} from "../controllers/SistemaParteController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const sistemaParteRouter = Router();

// 📌 Asignar una Parte a un Sistema
sistemaParteRouter.post("/assign", assignSistemaParte);

// 📌 Obtener todas las Partes de un Sistema
sistemaParteRouter.get("/sistema/:id_sistema", getPartesBySistema);

// 📌 Actualizar una Asociación
sistemaParteRouter.put("/:id_sistema_parte", updateSistemaParte);

// 📌 Desactivar una Asociación
sistemaParteRouter.delete("/:id_sistema_parte", deleteSistemaParte);

// 📌 Reactivar una Asociación
sistemaParteRouter.post("/reactivate", reactivateSistemaParte);

// 📌 Obtener todas las asociaciones activas con detalles
sistemaParteRouter.get("/all", getAllSistemasWithPartes);

export default sistemaParteRouter;
