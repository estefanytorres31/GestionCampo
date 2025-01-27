// services/HistorialPuertoService.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createHistorialPuerto = async (embarcacionId, puertoId, fechaLlegada, fechaSalida) => {
  // Verificar si la embarcación y el puerto existen y están activos
  const embarcacion = await prisma.embarcacion.findUnique({
    where: { id: parseInt(embarcacionId) },
  });

  if (!embarcacion || !embarcacion.estado) {
    throw new Error("La embarcación no existe o está inactiva.");
  }

  const puerto = await prisma.puerto.findUnique({
    where: { id: parseInt(puertoId) },
  });

  if (!puerto || !puerto.estado) {
    throw new Error("El puerto no existe o está inactivo.");
  }

  // Crear el historial de puerto
  const historial = await prisma.historialPuerto.create({
    data: {
      embarcacionId: parseInt(embarcacionId),
      puertoId: parseInt(puertoId),
      fechaLlegada: new Date(fechaLlegada),
      fechaSalida: fechaSalida ? new Date(fechaSalida) : null,
    },
  });

  return historial;
};

export const getHistorialByEmbarcacion = async (embarcacionId) => {
  const historial = await prisma.historialPuerto.findMany({
    where: { embarcacionId: parseInt(embarcacionId) },
    orderBy: { fechaLlegada: "desc" },
    include: {
      puerto: true,
    },
  });

  return historial;
};

export const getHistorialById = async (id) => {
  const historial = await prisma.historialPuerto.findUnique({
    where: { id: parseInt(id) },
    include: {
      embarcacion: true,
      puerto: true,
    },
  });

  if (!historial) {
    throw new Error("El historial de puerto no existe.");
  }

  return historial;
};

export const updateHistorialPuerto = async (id, fechaSalida) => {
  const historialExistente = await prisma.historialPuerto.findUnique({
    where: { id: parseInt(id) },
  });

  if (!historialExistente) {
    throw new Error("El historial de puerto no existe.");
  }

  const historialActualizado = await prisma.historialPuerto.update({
    where: { id: parseInt(id) },
    data: {
      fechaSalida: fechaSalida ? new Date(fechaSalida) : null,
      actualizadoEn: new Date(),
    },
  });

  return historialActualizado;
};

export const deleteHistorialPuerto = async (id) => {
  const historialExistente = await prisma.historialPuerto.findUnique({
    where: { id: parseInt(id) },
  });

  if (!historialExistente) {
    throw new Error("El historial de puerto no existe.");
  }

  // Realizar un soft delete (desactivar el historial)
  await prisma.historialPuerto.update({
    where: { id: parseInt(id) },
    data: { estado: false },
  });
};

export const getHistorialCompleto = async (embarcacionId) => {
    const historial = await prisma.historialPuerto.findMany({
      where: { embarcacionId: parseInt(embarcacionId) },
      orderBy: { fechaLlegada: "desc" },
      include: {
        puerto: true,
      },
    });
  
    return historial;
  };