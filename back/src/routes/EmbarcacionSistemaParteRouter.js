import { Router } from "express";
import {
    assignParteToEmbarcacionSistema,
    getPartesByEmbarcacionSistema,
    updateEmbarcacionSistemaParte,
    deleteEmbarcacionSistemaParte,
} from "../controllers/EmbarcacionSistemaParteController.js";

const embarcacionSistemaParteRouter = Router();

embarcacionSistemaParteRouter.post("/assign-parte", assignParteToEmbarcacionSistema);
embarcacionSistemaParteRouter.get("/:id_embarcacion_sistema", getPartesByEmbarcacionSistema);
embarcacionSistemaParteRouter.put("/:id_embarcacion_sistema_parte", updateEmbarcacionSistemaParte);
embarcacionSistemaParteRouter.delete("/:id_embarcacion_sistema_parte", deleteEmbarcacionSistemaParte);

export default embarcacionSistemaParteRouter;