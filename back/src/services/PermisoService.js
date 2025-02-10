import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crea o reactiva un permiso.
 * Se requiere que se envíen:
 *  - recursoId: ID del recurso al que pertenece el permiso.
 *  - accionId: ID de la acción (por ejemplo, "crear").
 *  - nombre: Nombre visible del permiso (por ejemplo, "Crear Usuario").
 *  - descripcion: Descripción opcional.
 */
export const createPermiso = async (
  recursoId,
  accionId,
  nombre,
  descripcion = null
) => {
  // Validaciones básicas
  if (!recursoId || isNaN(Number(recursoId))) {
    throw new Error("El recursoId es obligatorio y debe ser un número válido.");
  }
  if (!accionId || isNaN(Number(accionId))) {
    throw new Error("El accionId es obligatorio y debe ser un número válido.");
  }
  if (!nombre || typeof nombre !== "string") {
    throw new Error(
      "El nombre del permiso es obligatorio y debe ser una cadena."
    );
  }

  const fecha_creacion = getUTCTime(new Date().toISOString());

  // Verificar si ya existe un permiso para la combinación recurso-acción
  const permisoExistente = await prisma.permiso.findFirst({
    where: {
      recursoId: Number(recursoId),
      accionId: Number(accionId),
    },
  });

  if (permisoExistente) {
    if (!permisoExistente.estado) {
      // Reactivar el permiso inactivo
      return await prisma.permiso.update({
        where: { id: permisoExistente.id },
        data: {
          estado: true,
          actualizado_en: getUTCTime(new Date().toISOString()),
        },
      });
    }
    throw new Error(
      "El permiso para este recurso y acción ya existe y está activo."
    );
  }

  // Obtener el recurso y la acción para calcular la clave (key)
  // Obtener el recurso usando solo el nombre
  const resource = await prisma.recurso.findUnique({
    where: { id: Number(recursoId) },
    select: { nombre: true },
  });

  // Obtener la acción (se asume que en el modelo Accion sí tienes el campo key)
  const action = await prisma.accion.findUnique({
    where: { id: Number(accionId) },
    select: { key: true, nombre: true },
  });

  if (!resource || !action) {
    throw new Error("No se encontró el recurso o la acción especificada.");
  }

  const resourceKey = resource.nombre.toLowerCase().replace(/\s+/g, "");
  const actionKey = action.key || action.nombre.toLowerCase().replace(/\s+/g, "");
  const computedKey = `${resourceKey}.${actionKey}`;

  // Crear el nuevo permiso con la clave calculada.
  const nuevoPermiso = await prisma.permiso.create({
    data: {
      key: computedKey,
      recursoId: Number(recursoId),
      accionId: Number(accionId),
      nombre,
      descripcion,
      estado: true,
      creado_en: fecha_creacion,
      actualizado_en: fecha_creacion,
    },
  });

  return nuevoPermiso;
};

/**
 * Obtiene todos los permisos activos sin paginación, con posibilidad de filtrar
 * por nombre, estado, recurso y/o acción.
 * @param {Object} filters - Objeto con los filtros. Puede incluir:
 *    - nombre: string para filtrar por coincidencia parcial en el nombre.
 *    - estado: string ("true" o "false") para filtrar por estado.
 *    - recursoId: ID (number o string) para filtrar por recurso.
 *    - accionId: ID (number o string) para filtrar por acción.
 * @returns {Promise<Object>} - Objeto con total y data (la lista de permisos).
 */
// PermisoService.js
export const getAllPermisosFiltered = async (filters = {}) => {
  const { nombre, estado, recursoId, accionId, incompleto } = filters;
  const whereClause = {
    // Filtrar por estado: si se especifica, se usa; si no, se muestran solo los activos.
    estado: estado !== undefined ? estado === "true" : true,
  };

  if (nombre) {
    whereClause.nombre = { contains: nombre };
  }
  if (recursoId) {
    whereClause.recursoId = parseInt(recursoId, 10);
  }
  if (accionId) {
    whereClause.accionId = parseInt(accionId, 10);
  }

  // Obtener todos los permisos que cumplan la condición.
  let permisos = await prisma.permiso.findMany({
    where: whereClause,
    orderBy: { creado_en: "desc" },
    include: { recurso: true, accion: true },
  });

  // Si se solicita filtrar solo recursos incompletos (es decir, recursos que aún no tienen asignadas todas las acciones)
  if (incompleto === "true") {
    // Obtener la cantidad total de acciones activas.
    const totalActions = await prisma.accion.count({ where: { estado: true } });
    // Agrupar los permisos por recurso.
    const permisosPorRecurso = {};
    permisos.forEach((permiso) => {
      const rid = permiso.recursoId;
      if (!permisosPorRecurso[rid]) {
        permisosPorRecurso[rid] = [];
      }
      permisosPorRecurso[rid].push(permiso);
    });
    // Filtrar: solo se incluyen los recursos cuyo número de permisos sea menor que totalActions.
    const permisosFiltrados = [];
    for (const rid in permisosPorRecurso) {
      if (permisosPorRecurso[rid].length < totalActions) {
        permisosFiltrados.push(...permisosPorRecurso[rid]);
      }
    }
    permisos = permisosFiltrados;
  }

  return {
    total: permisos.length,
    data: permisos,
  };
};

/**
 * Obtiene todos los permisos activos con paginación y filtros.
 * Se pueden filtrar por nombre y estado.
 */
export const getAllPermisos = async (filters, page = 1, pageSize = 10) => {
  const { nombre, estado } = filters;
  const whereClause = {
    estado: estado !== undefined ? estado === "true" : true, // Activos por defecto
  };

  if (nombre) {
    whereClause.nombre = { contains: nombre };
  }

  const skip = (page - 1) * pageSize;

  // Se incluyen las relaciones con recurso y acción para mayor información
  const [permisos, total] = await Promise.all([
    prisma.permiso.findMany({
      where: whereClause,
      orderBy: { creado_en: "desc" },
      skip,
      take: pageSize,
      include: { recurso: true, accion: true },
    }),
    prisma.permiso.count({ where: whereClause }),
  ]);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    data: permisos,
  };
};

/**
 * Obtiene un permiso por su ID.
 */
export const getPermisoById = async (id) => {
  const permisoId = parseInt(id, 10);
  if (isNaN(permisoId)) {
    throw new Error("El ID del permiso debe ser un número válido.");
  }

  const permiso = await prisma.permiso.findUnique({
    where: { id: permisoId },
    include: { recurso: true, accion: true },
  });

  if (!permiso || !permiso.estado) {
    throw new Error(`El permiso con ID ${id} no existe o está inactivo.`);
  }

  return permiso;
};

/**
 * Actualiza un permiso.
 * Permite actualizar el nombre y la descripción.
 * (Si se desea permitir modificar recursoId o accionId, habría que validar la nueva combinación única).
 */
export const updatePermiso = async (id, nombre, descripcion) => {
  const permisoId = parseInt(id, 10);
  if (isNaN(permisoId)) {
    throw new Error("El ID del permiso debe ser un número válido.");
  }

  // Verificar que el permiso exista y esté activo
  const permisoExistente = await prisma.permiso.findUnique({
    where: { id: permisoId },
  });

  if (!permisoExistente || !permisoExistente.estado) {
    throw new Error(`El permiso con ID ${id} no existe o está inactivo.`);
  }

  // Si se actualiza el nombre, se podría verificar que no haya otro permiso activo con el mismo nombre.
  // (Opcional, ya que la unicidad en este modelo se basa en recursoId y accionId)
  if (nombre && nombre !== permisoExistente.nombre) {
    const permisoConMismoNombre = await prisma.permiso.findFirst({
      where: {
        nombre,
        id: { not: permisoId },
      },
    });
    if (permisoConMismoNombre) {
      throw new Error(`El permiso con el nombre "${nombre}" ya existe.`);
    }
  }

  const fecha_actualizacion = getUTCTime(new Date().toISOString());
  const permisoActualizado = await prisma.permiso.update({
    where: { id: permisoId },
    data: {
      nombre: nombre || permisoExistente.nombre,
      descripcion:
        descripcion !== undefined ? descripcion : permisoExistente.descripcion,
      actualizado_en: fecha_actualizacion,
    },
  });

  return permisoActualizado;
};

/**
 * Desactiva (eliminación lógica) un permiso.
 */
export const deletePermiso = async (id) => {
  const permisoId = parseInt(id, 10);
  if (isNaN(permisoId)) {
    throw new Error("El ID del permiso debe ser un número válido.");
  }

  const permisoExistente = await prisma.permiso.findUnique({
    where: { id: permisoId },
  });

  if (!permisoExistente || !permisoExistente.estado) {
    throw new Error(`El permiso con ID ${id} no existe o ya está inactivo.`);
  }

  const fecha_actualizacion = getUTCTime(new Date().toISOString());
  const permisoDesactivado = await prisma.permiso.update({
    where: { id: permisoId },
    data: {
      estado: false,
      actualizado_en: fecha_actualizacion,
    },
  });

  return permisoDesactivado;
};
