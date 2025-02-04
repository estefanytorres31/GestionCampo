import * as RolService from "../services/RolService.js";

// Crear un nuevo rol
export const createRol = async (req, res) => {
  const { nombre_rol, descripcion } = req.body;

  try {
    const rol = await RolService.createRol(nombre_rol, descripcion);
    // Determinar si se creó un nuevo rol o se reactivó uno existente
    const mensaje = rol.estado
      ? rol.creado_en === rol.actualizado_en
        ? "Rol creado exitosamente."
        : "Rol reactivado exitosamente."
      : "Rol creado exitosamente.";

    res.status(201).json({ message: mensaje, data: rol });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los roles
export const getAllRolesController = async (req, res) => {
  try {
    const filters = {
      nombre_rol: req.query.nombre_rol || undefined,
      estado: req.query.estado || undefined,
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await RolService.getAllRoles(filters, page, pageSize);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un rol por su ID
export const getRolById = async (req, res) => {
  const { id } = req.params;

  try {
    const rol = await RolService.getRolById(id);
    res.status(200).json({ message: "Rol obtenido exitosamente.", data: rol });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar un rol
export const updateRol = async (req, res) => {
  const { id } = req.params;
  const { nombre_rol, descripcion } = req.body;

  try {
    const rol = await RolService.updateRol(id, nombre_rol, descripcion);
    res
      .status(200)
      .json({ message: "Rol actualizado exitosamente.", data: rol });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar (desactivar) un rol
export const deleteRol = async (req, res) => {
  const { id } = req.params;

  try {
    const rol = await RolService.deleteRol(id);
    res
      .status(200)
      .json({ message: "Rol desactivado exitosamente.", data: rol });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
