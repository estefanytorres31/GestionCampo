import * as PermisoService from "../services/PermisoService.js";

export const createPermiso = async (req, res) => {
  const { nombre, descripcion, estado } = req.body;
  try {
    const nuevoPermiso = await PermisoService.createPermiso({ nombre, descripcion, estado });
    res.status(201).json(nuevoPermiso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerTodosLosPermisos = async (req, res) => {
  try {
    const permisos = await PermisoService.obtenerTodosLosPermisos();
    res.json(permisos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarPermiso = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;
  try {
    const permisoActualizado = await PermisoService.actualizarPermiso(id, { nombre, descripcion, estado });
    res.json(permisoActualizado);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const eliminarPermiso = async (req, res) => {
  const { id } = req.params;
  try {
    await PermisoService.eliminarPermiso(id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPermisoById = async (req, res) => {
  const { id } = req.params;
  try {
    const permiso = await PermisoService.getPermisoById(id);
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });
    res.json(permiso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
