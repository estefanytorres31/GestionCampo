import { Router } from "express";
import {
    crearAsistencia,
    obtenerAsistenciasPorUsuario,
    obtenerAsistenciasPorEmbarcacion,
    actualizarAsistencia,
    eliminarAsistencia,
} from "../controllers/AsistenciaController.js";

const asistenciaRouter = Router();

// 📌 Crear una Asistencia (Entrada o Salida)
asistenciaRouter.post("/", crearAsistencia);

// 📌 Obtener Asistencias por Usuario
asistenciaRouter.get("/usuario/:id_usuario", obtenerAsistenciasPorUsuario);

// 📌 Obtener Asistencias por Embarcación
asistenciaRouter.get("/embarcacion/:id_embarcacion", obtenerAsistenciasPorEmbarcacion);

// 📌 Actualizar una Asistencia
asistenciaRouter.put("/:id_asistencia", actualizarAsistencia);

// 📌 Eliminar una Asistencia
asistenciaRouter.delete("/:id_asistencia", eliminarAsistencia);

export default asistenciaRouter;