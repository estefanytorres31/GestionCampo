import {
    getAllAsistencias,
    getAsistenciaById,
    getAsistenciasByEmbarcacion,
    getAsistenciasByUsuario,
    registrarEntrada,
    registrarSalida,
    updateAsistencia,
    deleteAsistencia
} from "../controllers/AsistenciaController.js"
import {Router} from "express"

const asistenciaRouter= Router();

asistenciaRouter.get("/",getAllAsistencias)
asistenciaRouter.get("/:id",getAsistenciaById)
asistenciaRouter.get("/embarcacion/:id_embarcacion",getAsistenciasByEmbarcacion)
asistenciaRouter.get("/usuario/:id_usuario",getAsistenciasByUsuario)
asistenciaRouter.post("/entrada",registrarEntrada)
asistenciaRouter.post("/salida",registrarSalida)
asistenciaRouter.put("/:id",updateAsistencia)
asistenciaRouter.delete("/:id",deleteAsistencia)

export default asistenciaRouter;