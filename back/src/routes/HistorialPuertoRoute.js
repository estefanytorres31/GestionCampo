import express from "express";
import {
    registrarLlegada,
    registrarSalida,
    obtenerPuertoActual,
    obtenerHistorialPuertos,
} from "../controllers/HistorialPuertoController.js";

const historialPuertoRouter = express.Router();

historialPuertoRouter.post("/llegada", registrarLlegada);
historialPuertoRouter.post("/salida", registrarSalida);
historialPuertoRouter.get("/actual/:embarcacion_id", obtenerPuertoActual);
historialPuertoRouter.get("/historial/:embarcacion_id", obtenerHistorialPuertos);

export default historialPuertoRouter;
