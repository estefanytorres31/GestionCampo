import * as EmpresaService from "../services/EmpresaService.js";

export const createEmpresa = async (req, res) => {
    const { nombre } = req.body;
    const result = await EmpresaService.createEmpresa(nombre);
    res.status(result.status).json({ message: result.message, data: result.data, error: result.error });
};

export const getAllEmpresas = async (req, res) => {
    const result = await EmpresaService.getAllEmpresas();
    res.status(result.status).json({ message: result.message, data: result.data, error: result.error });
};

export const getEmpresaById = async (req, res) => {
    const { id } = req.params;
    const result = await EmpresaService.getEmpresaById(id);
    res.status(result.status).json({ message: result.message, data: result.data, error: result.error });
};

export const updateEmpresa = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const result = await EmpresaService.updateEmpresa(id, nombre);
    res.status(result.status).json({ message: result.message, data: result.data, error: result.error });
};

export const deleteEmpresa = async (req, res) => {
    const { id } = req.params;
    const result = await EmpresaService.deleteEmpresa(id);
    res.status(result.status).json({ message: result.message, data: result.data, error: result.error });
};
