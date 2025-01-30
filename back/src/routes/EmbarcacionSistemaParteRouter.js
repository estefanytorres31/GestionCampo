import {
    assignParteToEmbarcacionSistema,
    getPartesByEmbarcacionSistema,
    updateEmbarcacionSistemaParte,
    deleteEmbarcacionSistemaParte
} from "../controllers/EmbarcacionSistemaParteController.js";

import { Router } from "express";

const embarcacionSistemaParteRouter = Router();

// Crear una relación (id_parte es opcional)
embarcacionSistemaParteRouter.post("/", assignParteToEmbarcacionSistema);

// Obtener todas las partes activas de una embarcación-sistema
embarcacionSistemaParteRouter.get("/:id_embarcacion_sistema", getPartesByEmbarcacionSistema);

// Actualizar una relación específica
embarcacionSistemaParteRouter.put("/:id_embarcacion_sistema_parte", updateEmbarcacionSistemaParte);

// Desactivar una relación específica
embarcacionSistemaParteRouter.delete("/:id_embarcacion_sistema_parte", deleteEmbarcacionSistemaParte);

export default embarcacionSistemaParteRouter;
