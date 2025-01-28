import {
    assignSistemaToEmbarcacion,
    assignMultipleSistemasToEmbarcacion,
    deactivateSistemaFromEmbarcacion,
    reactivateSistemaFromEmbarcacion,
    getActiveSistemasByEmbarcacion,
    getAllEmbarcacionesWithSistemas,
} from "../controllers/EmbarcacionSistemaController.js";
import { Router } from "express";

const embarcacionSistemaRouter = Router();

embarcacionSistemaRouter.post("/assign", assignSistemaToEmbarcacion);
embarcacionSistemaRouter.post("/assign-multiple", assignMultipleSistemasToEmbarcacion);
embarcacionSistemaRouter.post("/deactivate", deactivateSistemaFromEmbarcacion);
embarcacionSistemaRouter.post("/reactivate", reactivateSistemaFromEmbarcacion);
embarcacionSistemaRouter.get("/active/:id_embarcacion", getActiveSistemasByEmbarcacion);
embarcacionSistemaRouter.get("/all", getAllEmbarcacionesWithSistemas);

export default embarcacionSistemaRouter;
