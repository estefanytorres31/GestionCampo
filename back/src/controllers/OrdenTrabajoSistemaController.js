import * as OrdenTrabajoSistemaService from "../services/OrdenTrabajoSistemaService.js";

/**
 * Crear una OrdenTrabajoSistema
 */
export const createOrdenTrabajoSistema = async (req, res) => {
    try {
        const orden = await OrdenTrabajoSistemaService.createOrdenTrabajoSistema(req.body);
        res.status(201).json({ message: "Orden de trabajo creada exitosamente.", data: orden });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajoSistema = async (req, res) => {
    try {
        const ordenes = await OrdenTrabajoSistemaService.getAllOrdenesTrabajoSistema();
        res.status(200).json({ message: "Órdenes de trabajo obtenidas exitosamente.", data: ordenes });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Obtener una OrdenTrabajoSistema por ID
 */
export const getOrdenTrabajoSistemaById = async (req, res) => {
    try {
        const orden = await OrdenTrabajoSistemaService.getOrdenTrabajoSistemaById(req.params.id);
        res.status(200).json({ message: "Orden de trabajo obtenida exitosamente.", data: orden });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Desactivar una OrdenTrabajoSistema
 */
export const deleteOrdenTrabajoSistema = async (req, res) => {
    try {
        const orden = await OrdenTrabajoSistemaService.deleteOrdenTrabajoSistema(req.params.id);
        res.status(200).json({ message: "Orden de trabajo desactivada exitosamente.", data: orden });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
