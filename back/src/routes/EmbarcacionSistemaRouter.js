import {
    assignSistemaToEmbarcacion,
    assignMultipleSistemasToEmbarcacion,
    deactivateSistemaFromEmbarcacion,
    reactivateSistemaFromEmbarcacion,
    getActiveSistemasByEmbarcacion,
    getAllEmbarcacionesWithSistemas,
    getIDSistemasEmbarcacion,
} from "../controllers/EmbarcacionSistemaController.js";
import { Router } from "express";
import {verificarAuth } from "../middleware/verificarAuth.js"

const embarcacionSistemaRouter = Router();

embarcacionSistemaRouter.post("/assign", assignSistemaToEmbarcacion);
embarcacionSistemaRouter.post("/assign-multiple", assignMultipleSistemasToEmbarcacion);
embarcacionSistemaRouter.post("/deactivate", deactivateSistemaFromEmbarcacion);
embarcacionSistemaRouter.post("/reactivate", reactivateSistemaFromEmbarcacion);
embarcacionSistemaRouter.get("/active/:id_embarcacion", getActiveSistemasByEmbarcacion);
embarcacionSistemaRouter.get("/ids/:id_embarcacion", getIDSistemasEmbarcacion);
embarcacionSistemaRouter.get("/all", getAllEmbarcacionesWithSistemas);

export default embarcacionSistemaRouter;
