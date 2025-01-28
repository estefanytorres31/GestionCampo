import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

export const assignEmpresaToEmbarcacion = async (empresaId, embarcacionId, fechaAsignacion) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);
  // Verificar si la empresa y la embarcación existen y están activas
  const empresa = await prisma.empresa.findUnique({
    where: { id: parseInt(empresaId) },
  });

  if (!empresa || !empresa.estado) {
    throw new Error("La empresa no existe o está inactiva.");
  }

  const embarcacion = await prisma.embarcacion.findUnique({
    where: { id: parseInt(embarcacionId) },
  });

  if (!embarcacion || !embarcacion.estado) {
    throw new Error("La embarcación no existe o está inactiva.");
  }

  // Asignar la empresa a la embarcación
  const asignacion = await prisma.empresaEmbarcacion.create({
    data: {
      empresaId: parseInt(empresaId),
      embarcacionId: parseInt(embarcacionId),
      fechaAsignacion:fecha_creacion,
      creadoEn:fecha_creacion,
      actualizadoEn:fecha_creacion
    },
  });

  return asignacion;
};

export const getEmbarcacionesByEmpresa = async (empresaId) => {
  const asignaciones = await prisma.empresaEmbarcacion.findMany({
    where: { empresaId: parseInt(empresaId) },
    include: {
      embarcacion: true,
    },
    orderBy: { fechaAsignacion: "desc" },
  });

  return asignaciones;
};

export const unassignEmpresaFromEmbarcacion = async (empresaId, embarcacionId) => {
  const asignacion = await prisma.empresaEmbarcacion.findUnique({
    where: {
      empresaId_embarcacionId: {
        empresaId: parseInt(empresaId),
        embarcacionId: parseInt(embarcacionId),
      },
    },
  });

  if (!asignacion) {
    throw new Error("La asignación no existe.");
  }

  await prisma.empresaEmbarcacion.delete({
    where: {
      empresaId_embarcacionId: {
        empresaId: parseInt(empresaId),
        embarcacionId: parseInt(embarcacionId),
      },
    },
  });
};

export const updateFechaAsignacion = async (empresaId, embarcacionId, nuevaFechaAsignacion) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);
    const asignacionExistente = await prisma.empresaEmbarcacion.findUnique({
      where: {
        actualizadoEn:fecha_creacion,
        empresaId_embarcacionId: {
          empresaId: parseInt(empresaId),
          embarcacionId: parseInt(embarcacionId),
        },
      },
    });
  
    if (!asignacionExistente) {
      throw new Error("La asignación no existe.");
    }
  
    const asignacionActualizada = await prisma.empresaEmbarcacion.update({
      where: {
        empresaId_embarcacionId: {
          empresaId: parseInt(empresaId),
          embarcacionId: parseInt(embarcacionId),
        },
      },
      data: {
        fechaAsignacion: new Date(nuevaFechaAsignacion),
        actualizadoEn: new Date(),
      },
    });
  
    return asignacionActualizada;
  };