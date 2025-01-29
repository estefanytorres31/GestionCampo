import * as EmpresaService from "../services/EmpresaService.js";

/**
 * Crear o reactivar una empresa.
 */
export const createEmpresa = async (req, res) => {
    const { nombre } = req.body;

    try {
        const empresa = await EmpresaService.createEmpresa(nombre);

        // Determinar si se creó o se reactivó
        const mensaje = empresa.creado_en.getTime() === empresa.actualizado_en.getTime()
            ? "Empresa creada exitosamente."
            : "Empresa reactivada exitosamente.";

        res.status(201).json({ message: mensaje, data: empresa });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Obtener todas las empresas activas.
 */
export const getAllEmpresas = async (req, res) => {
    try {
        const empresas = await EmpresaService.getAllEmpresas();
        res.status(200).json({ message: "Empresas obtenidas exitosamente.", data: empresas });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Obtener una empresa por su ID.
 */
export const getEmpresaById = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await EmpresaService.getEmpresaById(id);
        res.status(200).json({ message: "Empresa obtenida exitosamente.", data: empresa });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Actualizar una empresa existente.
 */
export const updateEmpresa = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const empresa = await EmpresaService.updateEmpresa(id, nombre);
        res.status(200).json({ message: "Empresa actualizada exitosamente.", data: empresa });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Desactivar una empresa.
 */
export const deleteEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await EmpresaService.deleteEmpresa(id);
        res.status(200).json({ message: "Empresa desactivada exitosamente.", data: empresa });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};