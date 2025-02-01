import * as OrdenTrabajoParteService from "../services/OrdenTrabajoParteService.js";

/**
 * Crear una OrdenTrabajoParte
 */
export const createOrdenTrabajoParte = async (req, res) => {
    try {
        const orden = await OrdenTrabajoParteService.createOrdenTrabajoParte(req.body);
        res.status(201).json({ message: "Orden de trabajo parte creada o reactivada exitosamente.", data: orden });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Obtener todas las órdenes de trabajo parte activas
 */
export const getAllOrdenesTrabajoParte = async (req, res) => {
    try {
        const ordenes = await OrdenTrabajoParteService.getAllOrdenesTrabajoParte();
        res.status(200).json({ message: "Órdenes de trabajo parte obtenidas exitosamente.", data: ordenes });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Obtener una OrdenTrabajoParte por ID
 */
export const getOrdenTrabajoParteById = async (req, res) => {
    const { id } = req.params;

    try {
        const orden = await OrdenTrabajoParteService.getOrdenTrabajoParteById(id);
        res.status(200).json({ message: "Orden de trabajo parte obtenida exitosamente.", data: orden });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Actualizar una OrdenTrabajoParte
 */
export const updateOrdenTrabajoParte = async (req, res) => {
    const { id } = req.params;

    try {
        const orden = await OrdenTrabajoParteService.updateOrdenTrabajoParte(id, req.body);
        res.status(200).json({ message: "Orden de trabajo parte actualizada exitosamente.", data: orden });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Desactivar una OrdenTrabajoParte
 */
export const deleteOrdenTrabajoParte = async (req, res) => {
    const { id } = req.params;

    try {
        const orden = await OrdenTrabajoParteService.deleteOrdenTrabajoParte(id);
        res.status(200).json({ message: "Orden de trabajo parte desactivada exitosamente.", data: orden });
    } catch (error) {
        if (error.message.includes("no existe") || error.message.includes("inactiva")) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};
