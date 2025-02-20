import { Router } from "express";
import {
    createOrReactivateTipoTrabajoESP,
    getAllTipoTrabajoESP,
    getTipoTrabajoESPById,
    updateTipoTrabajoESP,
    desactivarTipoTrabajoESP,
    getSistemasPorTipoTrabajoEmbarcacion,
    getSistemasPartesPorTipoTrabajoEmbarcacion,
    getPartesPorSistemaTipoTrabajoEmbarcacion,
    asignacionMultiple
} from "../controllers/TipoTrabajoEmbarcacionSistemaParteController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const tipoTrabajoESPRouter = Router();

// 📌 Crear o Reactivar una relación
tipoTrabajoESPRouter.post("/", createOrReactivateTipoTrabajoESP);

// 📌 Obtener todas las relaciones activas
tipoTrabajoESPRouter.get("/", getAllTipoTrabajoESP);

// 📌 Obtener una relación por su ID
tipoTrabajoESPRouter.get("/:id", getTipoTrabajoESPById);

// 📌 Actualizar una relación
tipoTrabajoESPRouter.put("/:id", updateTipoTrabajoESP);

// 📌 Desactivar una relación
tipoTrabajoESPRouter.delete("/:id", desactivarTipoTrabajoESP);

// 📌 Obtener lista de Sistemas para un Tipo de Trabajo y Embarcación (sin Partes)
tipoTrabajoESPRouter.get("/tipo/:id_tipo_trabajo/embarcacion/:id_embarcacion/sistemas", getSistemasPorTipoTrabajoEmbarcacion);

// 📌 Obtener lista de Sistemas y sus Partes para un Tipo de Trabajo y Embarcación
tipoTrabajoESPRouter.get("/tipo/:id_tipo_trabajo/embarcacion/:id_embarcacion/sistemas-partes", getSistemasPartesPorTipoTrabajoEmbarcacion);

// 📌 Obtener lista de Partes para un Sistema específico dentro de un Tipo de Trabajo y Embarcación
tipoTrabajoESPRouter.get("/tipo/:id_tipo_trabajo/embarcacion/:id_embarcacion/sistema/:id_sistema/partes", getPartesPorSistemaTipoTrabajoEmbarcacion);

// �� Asignación de múltiples relaciones

tipoTrabajoESPRouter.post("/asignacionmultpiple", asignacionMultiple);

export default tipoTrabajoESPRouter;