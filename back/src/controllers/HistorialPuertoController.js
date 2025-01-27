// controllers/HistorialPuertoController.js

import * as HistorialPuertoService from "../services/HistorialPuertoService.js";

export const createHistorialPuerto = async (req, res) => {
  const { embarcacionId, puertoId, fechaLlegada, fechaSalida } = req.body;
  try {
    const historial = await HistorialPuertoService.createHistorialPuerto(
      embarcacionId,
      puertoId,
      fechaLlegada,
      fechaSalida
    );
    res.status(201).json(historial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHistorialByEmbarcacion = async (req, res) => {
  const { embarcacionId } = req.params;
  try {
    const historial = await HistorialPuertoService.getHistorialByEmbarcacion(embarcacionId);
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHistorialById = async (req, res) => {
  const { id } = req.params;
  try {
    const historial = await HistorialPuertoService.getHistorialById(id);
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateHistorialPuerto = async (req, res) => {
  const { id } = req.params;
  const { fechaSalida } = req.body;
  try {
    const historial = await HistorialPuertoService.updateHistorialPuerto(id, fechaSalida);
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteHistorialPuerto = async (req, res) => {
  const { id } = req.params;
  try {
    await HistorialPuertoService.deleteHistorialPuerto(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHistorialCompleto = async (req, res) => {
    const { embarcacionId } = req.params;
    try {
      const historial = await HistorialPuertoService.getHistorialCompleto(embarcacionId);
      res.status(200).json(historial);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };