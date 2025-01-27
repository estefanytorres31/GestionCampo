import * as PuertoService from "../services/PuertoService.js";

export const createPuerto = async (req, res) => {
  const { nombre, ubicacion } = req.body;
  try {
    const puerto = await PuertoService.createPuerto(nombre, ubicacion);
    res.status(201).json(puerto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPuertos = async (req, res) => {
  try {
    const puertos = await PuertoService.getAllPuertos();
    res.status(200).json(puertos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPuertoById = async (req, res) => {
  const { id } = req.params;
  try {
    const puerto = await PuertoService.getPuertoById(id);
    res.status(200).json(puerto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePuerto = async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion } = req.body;
  try {
    const puerto = await PuertoService.updatePuerto(id, nombre, ubicacion);
    res.status(200).json(puerto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePuerto = async (req, res) => {
  const { id } = req.params;
  try {
    await PuertoService.deletePuerto(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
