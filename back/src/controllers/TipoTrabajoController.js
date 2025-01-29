import * as TipoTrabajoService from "../services/TipoTrabajoService.js";

// Crear o reactivar un TipoTrabajo
export const createTipoTrabajo = async (req, res) => {
    const { nombre_trabajo, descripcion } = req.body;

    try {
        const tipoTrabajo = await TipoTrabajoService.createTipoTrabajo(nombre_trabajo, descripcion);
        res.status(201).json({ message: "Tipo de trabajo creado o reactivado exitosamente.", data: tipoTrabajo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los TipoTrabajo
export const getAllTipoTrabajos = async (req, res) => {
    try {
        const tipoTrabajos = await TipoTrabajoService.getAllTipoTrabajos();
        res.status(200).json({ message: "Tipos de trabajo obtenidos exitosamente.", data: tipoTrabajos });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener un TipoTrabajo por ID
export const getTipoTrabajoById = async (req, res) => {
    const { id } = req.params;

    try {
        const tipoTrabajo = await TipoTrabajoService.getTipoTrabajoById(id);
        res.status(200).json({ message: "Tipo de trabajo obtenido exitosamente.", data: tipoTrabajo });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Actualizar un TipoTrabajo
export const updateTipoTrabajo = async (req, res) => {
    const { id } = req.params;
    const { nombre_trabajo, descripcion, estado } = req.body;

    try {
        if (!nombre_trabajo && descripcion === undefined && estado === undefined) {
            return res.status(400).json({ message: "Debe proporcionar al menos un campo válido para actualizar." });
        }

        const tipoTrabajo = await TipoTrabajoService.updateTipoTrabajo(id, nombre_trabajo, descripcion, estado);
        res.status(200).json({ message: "Tipo de trabajo actualizado exitosamente.", data: tipoTrabajo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Eliminar (desactivar) un TipoTrabajo
export const deleteTipoTrabajo = async (req, res) => {
    const { id } = req.params;

    try {
        const tipoTrabajo = await TipoTrabajoService.deleteTipoTrabajo(id);
        res.status(200).json({ message: "Tipo de trabajo desactivado exitosamente.", data: tipoTrabajo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
