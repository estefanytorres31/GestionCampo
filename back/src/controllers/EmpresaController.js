import * as EmpresaService from "../services/EmpresaService.js";

// Crear una nueva empresa
export const createEmpresa = async (req, res) => {
    const { nombre } = req.body;

    try {
        const empresa = await EmpresaService.createEmpresa(nombre);
        res.status(201).json({ message: "Empresa creada exitosamente.", data: empresa });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todas las empresas
export const getAllEmpresas = async (req, res) => {
    try {
        const empresas = await EmpresaService.getAllEmpresas();
        res.status(200).json( empresas );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Obtener una empresa por su ID
export const getEmpresaById = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await EmpresaService.getEmpresaById(id);
        res.status(200).json({ message: "Empresa obtenida exitosamente.", data: empresa });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Actualizar una empresa
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

// Eliminar (desactivar) una empresa
export const deleteEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await EmpresaService.deleteEmpresa(id);
        res.status(200).json({ message: "Empresa desactivada exitosamente.", data: empresa });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
