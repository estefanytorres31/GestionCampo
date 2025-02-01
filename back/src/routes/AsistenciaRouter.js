import { Router } from "express";
import {
    crearAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    obtenerAsistenciaPorId,
    obtenerAsistencias,
    getAsistencias,
} from "../controllers/AsistenciaController.js";

const asistenciaRouter = Router();

// 📌 Crear una Asistencia (Entrada o Salida)
asistenciaRouter.post("/", crearAsistencia);

// 📌 Obtener Asistencias con filtros (?id_usuario= , ?id_embarcacion= , ?id_orden_trabajo= )
asistenciaRouter.get("/", obtenerAsistencias);
asistenciaRouter.get("/view", getAsistencias);

// 📌 Obtener una asistencia por su ID
asistenciaRouter.get("/:id", obtenerAsistenciaPorId);

// 📌 Actualizar una Asistencia
asistenciaRouter.put("/:id_asistencia", actualizarAsistencia);

// 📌 Eliminar una Asistencia
asistenciaRouter.delete("/:id_asistencia", eliminarAsistencia);

export default asistenciaRouter;