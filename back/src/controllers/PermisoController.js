import * as PermisoService from "../services/PermisoService.js";

/**
 * Crear un nuevo permiso.
 * Se espera recibir en el body: recursoId, accionId, nombre y descripción.
 */
export const createPermiso = async (req, res) => {
  const { recursoId, accionId, nombre, descripcion } = req.body;

  try {
    const permiso = await PermisoService.createPermiso(recursoId, accionId, nombre, descripcion);

    // Se determina si se creó o se reactivó
    const mensaje =
      permiso.creado_en.getTime() === permiso.actualizado_en.getTime()
        ? "Permiso creado exitosamente."
        : "Permiso reactivado exitosamente.";

    res.status(201).json({ message: mensaje, data: permiso });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtener todos los permisos activos sin paginación, con filtros.
 * Se pueden filtrar por nombre, estado, recurso y acción.
 */
export const getAllPermisosFilteredController = async (req, res) => {
  try {
    // Extraer los filtros de la query string
    const filters = {
      nombre: req.query.nombre || undefined,
      estado: req.query.estado || undefined,
      recursoId: req.query.recursoId || undefined,
      accionId: req.query.accionId || undefined,
      incompleto: req.query.incompleto || undefined,
    };

    const result = await PermisoService.getAllPermisosFiltered(filters);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener todos los permisos (con paginación y filtros).
 */
export const getAllPermisosController = async (req, res) => {
  try {
    const filters = {
      nombre: req.query.nombre || undefined,
      estado: req.query.estado || undefined,
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await PermisoService.getAllPermisos(filters, page, pageSize);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener un permiso por su ID.
 */
export const getPermisoById = async (req, res) => {
  const { id } = req.params;

  try {
    const permiso = await PermisoService.getPermisoById(id);
    res.status(200).json({ message: "Permiso obtenido exitosamente.", data: permiso });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Actualizar un permiso.
 */
export const updatePermiso = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const permiso = await PermisoService.updatePermiso(id, nombre, descripcion);
    res.status(200).json({ message: "Permiso actualizado exitosamente.", data: permiso });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Desactivar (eliminar lógicamente) un permiso.
 */
export const deletePermiso = async (req, res) => {
  const { id } = req.params;

  try {
    const permiso = await PermisoService.deletePermiso(id);
    res.status(200).json({ message: "Permiso desactivado exitosamente.", data: permiso });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
