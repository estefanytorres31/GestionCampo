import * as EmpresaEmbarcacionService from "../services/EmpresaEmbarcacionService.js";

export const assignEmpresaToEmbarcacion = async (req, res) => {
  const { empresaId, embarcacionId, fechaAsignacion } = req.body;
  try {
    const asignacion = await EmpresaEmbarcacionService.assignEmpresaToEmbarcacion(
      empresaId,
      embarcacionId,
      fechaAsignacion
    );
    res.status(201).json(asignacion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmbarcacionesByEmpresa = async (req, res) => {
  const { empresaId } = req.params;
  try {
    const embarcaciones = await EmpresaEmbarcacionService.getEmbarcacionesByEmpresa(empresaId);
    res.status(200).json(embarcaciones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unassignEmpresaFromEmbarcacion = async (req, res) => {
  const { empresaId, embarcacionId } = req.params;
  try {
    await EmpresaEmbarcacionService.unassignEmpresaFromEmbarcacion(empresaId, embarcacionId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFechaAsignacion = async (req, res) => {
    const { empresaId, embarcacionId } = req.params;
    const { nuevaFechaAsignacion } = req.body;
    try {
      const asignacion = await EmpresaEmbarcacionService.updateFechaAsignacion(
        empresaId,
        embarcacionId,
        nuevaFechaAsignacion
      );
      res.status(200).json(asignacion);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };