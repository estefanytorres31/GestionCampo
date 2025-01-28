import * as EmbarcacionService from "../services/EmbarcacionService.js";

export const createEmbarcacion = async (req, res) => {
  const {nombre, empresa_id } = req.body;
  try {
    const embarcacion = await EmbarcacionService.createEmbarcacion(
      nombre,
      empresa_id
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
  const { nombre, datosQrCode, ubicacion, empresaId } = req.body;
  try {
    const embarcacion = await EmbarcacionService.updateEmbarcacion(
      id,
      nombre,
      datosQrCode,
      ubicacion,
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

export const getEmbarcacionesByEmpresa = async (req, res) => {
  const { empresa_id } = req.params;
  try {
    const embarcaciones = await EmbarcacionService.getEmbarcacionByEmpresa(empresa_id);
    res.status(200).json(embarcaciones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
