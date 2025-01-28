import { getPeruTime, getUTCTime } from "../utils/Time.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Crea una nueva embarcación.
 * @param {string} identificadorBarco - Identificador único del barco.
 * @param {string} nombre - Nombre de la embarcación.
 * @param {string} datosQrCode - Datos del QR Code.
 * @param {string} [ubicacion] - Ubicación actual de la embarcación.
 * @param {number} puertoId - ID del puerto actual.
 * @param {number} empresaId - ID de la empresa propietaria.
 * @returns {Promise<Object>} - La embarcación creada.
 */
export const createEmbarcacion = async (identificadorBarco, nombre, datosQrCode, ubicacion, puertoId, empresaId) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);
  // Verificar si ya existe una embarcación con el mismo identificador
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { identificadorBarco },
  });

  if (embarcacionExistente) {
    throw new Error("Ya existe una embarcación con ese identificador.");
  }

  // Verificar si el puerto existe y está activo
  const puerto = await prisma.puerto.findUnique({
    where: { id: parseInt(puertoId) },
  });

  if (!puerto || !puerto.estado) {
    throw new Error("El puerto no existe o está inactivo.");
  }

  // Verificar si la empresa existe y está activa
  const empresa = await prisma.empresa.findUnique({
    where: { id: parseInt(empresaId) },
  });

  if (!empresa || !empresa.estado) {
    throw new Error("La empresa no existe o está inactiva.");
  }

  // Crear la embarcación
  const embarcacion = await prisma.embarcacion.create({
    data: {
      identificadorBarco,
      nombre,
      datosQrCode,
      ubicacion,
      puertoId,
      empresaId,
      creadoEn:fecha_creacion,
      actualizadoEn:fecha_creacion
    },
  });

  return embarcacion;
};

/**
 * Obtiene todas las embarcaciones activas.
 * @returns {Promise<Array>} - Lista de embarcaciones.
 */
export const getAllEmbarcaciones = async () => {
  const embarcaciones = await prisma.embarcacion.findMany({
    where: { estado: true },
    include: {
      puerto: true,
      empresa: true,
    },
    orderBy: { nombre: "asc" },
  });
  return embarcaciones;
};

/**
 * Obtiene una embarcación por su ID.
 * @param {number} id - ID de la embarcación.
 * @returns {Promise<Object>} - La embarcación encontrada.
 */
export const getEmbarcacionById = async (id) => {
  const embarcacion = await prisma.embarcacion.findUnique({
    where: { id: parseInt(id) },
    include: {
      puerto: true,
      empresa: true,
    },
  });

  if (!embarcacion) {
    throw new Error("La embarcación no existe.");
  }

  return embarcacion;
};

/**
 * Actualiza una embarcación existente.
 * @param {number} id - ID de la embarcación a actualizar.
 * @param {string} [nombre] - Nuevo nombre de la embarcación.
 * @param {string} [ubicacion] - Nueva ubicación de la embarcación.
 * @param {number} [puertoId] - Nuevo ID del puerto.
 * @param {number} [empresaId] - Nuevo ID de la empresa propietaria.
 * @returns {Promise<Object>} - La embarcación actualizada.
 */
export const updateEmbarcacion = async (id, nombre, ubicacion, puertoId, empresaId) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);
  // Verificar si la embarcación existe
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { id: parseInt(id) },
  });

  if (!embarcacionExistente) {
    throw new Error("La embarcación no existe.");
  }

  // Verificar si el nuevo puerto existe y está activo
  if (puertoId) {
    const puerto = await prisma.puerto.findUnique({ where: { id: puertoId } });
    if (!puerto || !puerto.estado) {
      throw new Error("El puerto no existe o está inactivo.");
    }
  }

  // Verificar si la nueva empresa existe y está activa
  if (empresaId) {
    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa || !empresa.estado) {
      throw new Error("La empresa no existe o está inactiva.");
    }
  }

  // Actualizar la embarcación
  const embarcacionActualizada = await prisma.embarcacion.update({
    where: { id: parseInt(id) },
    data: {
      nombre: nombre || embarcacionExistente.nombre,
      ubicacion: ubicacion || embarcacionExistente.ubicacion,
      puertoId: puertoId || embarcacionExistente.puertoId,
      empresaId: empresaId || embarcacionExistente.empresaId,
      actualizadoEn: fecha_creacion,
    },
  });

  return embarcacionActualizada;
};

/**
 * Desactiva una embarcación (soft delete).
 * @param {number} id - ID de la embarcación a desactivar.
 * @returns {Promise<void>}
 */
export const deleteEmbarcacion = async (id) => {
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { id: parseInt(id) },
  });

  if (!embarcacionExistente) {
    throw new Error("La embarcación no existe.");
  }

  // Realizar un soft delete (desactivar la embarcación)
  await prisma.embarcacion.update({
    where: { id: parseInt(id) },
    data: { estado: false },
  });
};
