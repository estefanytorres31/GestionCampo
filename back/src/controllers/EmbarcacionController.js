import * as EmbarcacionService from "../services/EmbarcacionService.js";

export const createEmbarcacion = async (req, res) => {
  const { identificadorBarco, nombre, datosQrCode, ubicacion, puertoId, empresaId } = req.body;
  try {
    const embarcacion = await EmbarcacionService.createEmbarcacion(
      identificadorBarco,
      nombre,
      datosQrCode,
      ubicacion,
      puertoId,
      empresaId
    );
    res.status(201).json(embarcacion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllEmbarcaciones = async (req, res) => {
  try {
    const embarcaciones = await EmbarcacionService.getAllEmbarcaciones();
    res.status(200).json(embarcaciones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmbarcacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const embarcacion = await EmbarcacionService.getEmbarcacionById(id);
    res.status(200).json(embarcacion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmbarcacion = async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion, puertoId, empresaId } = req.body;
  try {
    const embarcacion = await EmbarcacionService.updateEmbarcacion(
      id,
      nombre,
      ubicacion,
      puertoId,
      empresaId
    );
    res.status(200).json(embarcacion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEmbarcacion = async (req, res) => {
  const { id } = req.params;
  try {
    await EmbarcacionService.deleteEmbarcacion(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
