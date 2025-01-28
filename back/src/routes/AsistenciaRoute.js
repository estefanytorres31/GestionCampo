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
asistenciaRouter.get("/embarcacion/:id",getAsistenciasByEmbarcacion)
asistenciaRouter.get("/usuario/:id",getAsistenciasByUsuario)
asistenciaRouter.post("/entrada",registrarEntrada)
asistenciaRouter.post("/salida",registrarSalida)
asistenciaRouter.put("/:id",updateAsistencia)
asistenciaRouter.delete("/:id",deleteAsistencia)

export default asistenciaRouter;