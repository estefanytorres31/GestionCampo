import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crea o reactiva un nuevo recurso.
 * @param {string} nombre - Nombre del recurso (ej. "usuarios").
 * @param {string} [descripcion] - Descripción opcional.
 * @returns {Promise<Object>} - El recurso creado o reactivado.
 */
export const createRecurso = async (nombre, descripcion = null) => {
  if (!nombre || typeof nombre !== "string") {
    throw {
      status: 400,
      message: "El nombre del recurso es obligatorio y debe ser una cadena.",
    };
  }

  const fechaActual = getUTCTime(new Date().toISOString());

  // Verificar si el recurso ya existe (incluyendo inactivos)
  const recursoExistente = await prisma.recurso.findUnique({
    where: { nombre },
  });

  if (recursoExistente) {
    if (recursoExistente.estado) {
      throw {
        status: 400,
        message: `El recurso con el nombre "${nombre}" ya existe y está activo.`,
      };
    } else {
      // Reactivar el recurso si estaba desactivado
      const recursoReactivado = await prisma.recurso.update({
        where: { id: recursoExistente.id },
        data: {
          estado: true,
          actualizado_en: fechaActual,
        },
      });
      return recursoReactivado;
    }
  }

  // Crear nuevo recurso si no existe
  const nuevoRecurso = await prisma.recurso.create({
    data: {
      nombre,
      descripcion,
      estado: true,
      creado_en: fechaActual,
      actualizado_en: fechaActual,
    },
  });

  return nuevoRecurso;
};

/**
 * Obtiene todos los recursos activos, y si se pasa el parámetro 'incompleto=true'
 * se devuelven solo aquellos que aún no tienen asignado el total de permisos (es decir, incompletos).
 * @param {Object} filters - Objeto con filtros. Puede incluir:
 *    - incompleto: string ("true") para listar solo los recursos incompletos.
 * @returns {Promise<Array>} - Lista de recursos filtrados.
 */
export const getAllRecursos = async (filters = {}) => {
  const { incompleto } = filters;

  // Se obtiene todos los recursos activos, incluyendo la relación de permisos.
  const recursos = await prisma.recurso.findMany({
    where: { estado: true },
    orderBy: { creado_en: "desc" },
    include: { permisos: true }, // Necesario para contar los permisos asignados
  });

  if (recursos.length === 0) {
    throw { status: 404, message: "No se encontraron recursos activos." };
  }

  // Si se indica el filtro 'incompleto', obtener el total de acciones activas y filtrar.
  if (incompleto === "true") {
    const totalActions = await prisma.accion.count({ where: { estado: true } });
    const recursosIncompletos = recursos.filter(
      (r) => (r.permisos ? r.permisos.length : 0) < totalActions
    );
    return recursosIncompletos;
  }

  return recursos;
};

/**
 * Obtiene un recurso por su ID.
 * @param {number} id - ID del recurso.
 * @returns {Promise<Object>} - El recurso encontrado.
 */
export const getRecursoById = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw { status: 400, message: "El ID proporcionado no es válido." };
  }

  const recurso = await prisma.recurso.findUnique({
    where: { id: parsedId },
  });

  if (!recurso || !recurso.estado) {
    throw { status: 404, message: "El recurso no existe o está desactivado." };
  }

  return recurso;
};

/**
 * Actualiza un recurso existente.
 * @param {number} id - ID del recurso a actualizar.
 * @param {string} nombre - Nuevo nombre del recurso.
 * @param {string} [descripcion] - Nueva descripción (opcional).
 * @returns {Promise<Object>} - El recurso actualizado.
 */
export const updateRecurso = async (id, nombre, descripcion = null) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw { status: 400, message: "El ID proporcionado no es válido." };
  }

  if (!nombre || typeof nombre !== "string") {
    throw {
      status: 400,
      message: "El nombre del recurso es obligatorio y debe ser una cadena.",
    };
  }

  const fechaActualizacion = getUTCTime(new Date().toISOString());

  // Verificar si otro recurso con el mismo nombre ya está activo
  const otroRecurso = await prisma.recurso.findUnique({
    where: { nombre },
  });

  if (otroRecurso && otroRecurso.id !== parsedId && otroRecurso.estado) {
    throw {
      status: 400,
      message: `Otro recurso con el nombre "${nombre}" ya existe y está activo.`,
    };
  }

  const recursoExistente = await prisma.recurso.findUnique({
    where: { id: parsedId },
  });

  if (!recursoExistente || !recursoExistente.estado) {
    throw { status: 404, message: "El recurso no existe o está desactivado." };
  }

  const recursoActualizado = await prisma.recurso.update({
    where: { id: parsedId },
    data: {
      nombre,
      descripcion,
      actualizado_en: fechaActualizacion,
    },
  });

  return recursoActualizado;
};

/**
 * Desactiva (eliminación lógica) un recurso.
 * @param {number} id - ID del recurso a desactivar.
 * @returns {Promise<Object>} - El recurso desactivado.
 */
export const deleteRecurso = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw { status: 400, message: "El ID proporcionado no es válido." };
  }

  const recursoExistente = await prisma.recurso.findUnique({
    where: { id: parsedId },
  });

  if (!recursoExistente || !recursoExistente.estado) {
    throw {
      status: 404,
      message: "El recurso no existe o ya está desactivado.",
    };
  }

  const fechaActual = getUTCTime(new Date().toISOString());

  const recursoDesactivado = await prisma.recurso.update({
    where: { id: parsedId },
    data: {
      estado: false,
      actualizado_en: fechaActual,
    },
  });

  return recursoDesactivado;
};
