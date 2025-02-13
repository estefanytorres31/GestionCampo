import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crea o reactiva una nueva acción.
 * @param {string} key - Clave única de la acción (ej. "crear").
 * @param {string} nombre - Nombre visible de la acción (ej. "Crear").
 * @param {string} [descripcion] - Descripción opcional.
 * @returns {Promise<Object>} - La acción creada o reactivada.
 */
export const createAccion = async (key, nombre, descripcion = null) => {
    if (!key || typeof key !== "string") {
      throw { status: 400, message: "La clave de la acción es obligatoria y debe ser una cadena." };
    }
    if (!nombre || typeof nombre !== "string") {
      throw { status: 400, message: "El nombre de la acción es obligatorio y debe ser una cadena." };
    }
  
    const fechaActual = getUTCTime(new Date().toISOString());
  
    // Buscar acción existente usando findUnique y el campo 'key'
    const accionExistente = await prisma.accion.findUnique({
      where: { key },
    });
  
    if (accionExistente) {
      if (accionExistente.estado) {
        throw { status: 400, message: `La acción con la clave "${key}" ya existe y está activa.` };
      } else {
        // Reactivar la acción si estaba desactivada
        const accionReactivada = await prisma.accion.update({
          where: { id: accionExistente.id },
          data: {
            estado: true,
            actualizado_en: fechaActual,
          },
        });
        return accionReactivada;
      }
    }
  
    // Crear nueva acción si no existe
    const nuevaAccion = await prisma.accion.create({
      data: {
        key, // Ejemplo: "CREAR"
        nombre,
        descripcion,
        estado: true,
        creado_en: fechaActual,
        actualizado_en: fechaActual,
      },
    });
  
    return nuevaAccion;
  };
  

/**
 * Obtiene todas las acciones activas.
 * @returns {Promise<Array>} - Lista de acciones.
 */
export const getAllAcciones = async () => {
  const acciones = await prisma.accion.findMany({
    where: { estado: true },
    orderBy: { creado_en: "desc" },
  });

  if (acciones.length === 0) {
    throw { status: 404, message: "No se encontraron acciones activas." };
  }

  return acciones;
};

/**
 * Obtiene una acción por su ID.
 * @param {number} id - ID de la acción.
 * @returns {Promise<Object>} - La acción encontrada.
 */
export const getAccionById = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw { status: 400, message: "El ID proporcionado no es válido." };
  }

  const accion = await prisma.accion.findUnique({
    where: { id: parsedId },
  });

  if (!accion || !accion.estado) {
    throw { status: 404, message: "La acción no existe o está desactivada." };
  }

  return accion;
};

/**
 * Actualiza una acción existente.
 * @param {number} id - ID de la acción a actualizar.
 * @param {string} key - Nueva clave de la acción.
 * @param {string} nombre - Nuevo nombre de la acción.
 * @param {string} [descripcion] - Nueva descripción (opcional).
 * @returns {Promise<Object>} - La acción actualizada.
 */
export const updateAccion = async (id, key, nombre, descripcion = null) => {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw { status: 400, message: "El ID proporcionado no es válido." };
    }
  
    if (!key || typeof key !== "string") {
      throw { status: 400, message: "La clave de la acción es obligatoria y debe ser una cadena." };
    }
    if (!nombre || typeof nombre !== "string") {
      throw { status: 400, message: "El nombre de la acción es obligatorio y debe ser una cadena." };
    }
  
    const fechaActualizacion = getUTCTime(new Date().toISOString());
  
    // Verificar si existe otra acción activa con la misma clave (excluyendo la que se está actualizando)
    const otraAccion = await prisma.accion.findFirst({
      where: {
        key,
        estado: true,
        NOT: { id: parsedId }
      }
    });
  
    if (otraAccion) {
      throw { status: 400, message: `Otra acción con la clave "${key}" ya existe y está activa.` };
    }
  
    // Buscar la acción que se quiere actualizar por su ID
    const accionExistente = await prisma.accion.findUnique({
      where: { id: parsedId },
    });
  
    if (!accionExistente || !accionExistente.estado) {
      throw { status: 404, message: "La acción no existe o está desactivada." };
    }
  
    const accionActualizada = await prisma.accion.update({
      where: { id: parsedId },
      data: {
        key,
        nombre,
        descripcion,
        actualizado_en: fechaActualizacion,
      },
    });
  
    return accionActualizada;
  };
  
/**
 * Desactiva (eliminación lógica) una acción.
 * @param {number} id - ID de la acción a desactivar.
 * @returns {Promise<Object>} - La acción desactivada.
 */
export const deleteAccion = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw { status: 400, message: "El ID proporcionado no es válido." };
  }

  const accionExistente = await prisma.accion.findUnique({
    where: { id: parsedId },
  });

  if (!accionExistente || !accionExistente.estado) {
    throw { status: 404, message: "La acción no existe o ya está desactivada." };
  }

  const fechaActual = getUTCTime(new Date().toISOString());

  const accionDesactivada = await prisma.accion.update({
    where: { id: parsedId },
    data: {
      estado: false,
      actualizado_en: fechaActual,
    },
  });

  return accionDesactivada;
};
