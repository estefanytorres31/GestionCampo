import { Router } from "express";
import {
    crearAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    obtenerAsistenciaPorId,
    obtenerAsistencias,
    getAsistenciasController,
    getLastAsistenciaByUsusario
} from "../controllers/AsistenciaController.js";
import {verificarAuth } from "../middleware/verificarAuth.js"

const asistenciaRouter = Router();

// 📌 Crear una Asistencia (Entrada o Salida)
asistenciaRouter.post("/", crearAsistencia);

// 📌 Obtener Asistencias con filtros (?id_usuario= , ?id_embarcacion= , ?id_orden_trabajo= )
asistenciaRouter.get("/lista", obtenerAsistencias);

asistenciaRouter.get("/", getAsistenciasController);

// 📌 Obtener una asistencia por su ID
asistenciaRouter.get("/:id", obtenerAsistenciaPorId);

// 📌 Actualizar una Asistencia
asistenciaRouter.put("/:id_asistencia", actualizarAsistencia);

// 📌 Eliminar una Asistencia
asistenciaRouter.delete("/:id_asistencia", eliminarAsistencia);

// �� Obtener última asistencia de un usuario

asistenciaRouter.get("/usuario/:id_usuario", getLastAsistenciaByUsusario);

export default asistenciaRouter;