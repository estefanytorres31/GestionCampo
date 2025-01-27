// controllers/EmpresaController.js

import * as EmpresaService from "../services/EmpresaService.js";

export const createEmpresa = async (req, res) => {
  const { nombre, razonSocial } = req.body;
  try {
    const empresa = await EmpresaService.createEmpresa(nombre, razonSocial);
    res.status(201).json(empresa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await EmpresaService.getAllEmpresas();
    res.status(200).json(empresas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmpresaById = async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await EmpresaService.getEmpresaById(id);
    res.status(200).json(empresa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmpresa = async (req, res) => {
  const { id } = req.params;
  const { nombre, razonSocial } = req.body;
  try {
    const empresa = await EmpresaService.updateEmpresa(id, nombre, razonSocial);
    res.status(200).json(empresa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    await EmpresaService.deleteEmpresa(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
