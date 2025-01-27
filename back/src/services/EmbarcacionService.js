import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEmbarcacion = async (identificadorBarco, nombre, datosQrCode, ubicacion, empresaId) => {
  const empresa = await prisma.empresa.findUnique({
    where: { id: empresaId },
  });

  if (!empresa || !empresa.estado) {
    throw new Error("La empresa especificada no existe o está inactiva.");
  }

  const embarcacion = await prisma.embarcacion.create({
    data: {
      identificadorBarco,
      nombre,
      datosQrCode,
      ubicacion,
      empresas: {
        create: {
          empresaId: empresaId,
          fechaAsignacion: new Date(),
        },
      },
    },
    include: {
      empresas: {
        include: {
          empresa: true,
        },
      },
    },
  });

  return embarcacion;
};

export const getAllEmbarcaciones = async () => {
  const embarcaciones = await prisma.embarcacion.findMany({
    where: { estado: true },
    include: {
      empresas: {
        include: {
          empresa: true,
        },
      },
    },
    orderBy: { nombre: "asc" },
  });

  return embarcaciones;
};

export const getEmbarcacionById = async (id) => {
  const embarcacion = await prisma.embarcacion.findUnique({
    where: { id: parseInt(id) },
    include: {
      empresas: {
        include: {
          empresa: true,
        },
      },
    },
  });

  if (!embarcacion) {
    throw new Error("La embarcación no existe.");
  }

  return embarcacion;
};

export const updateEmbarcacion = async (id, nombre, datosQrCode, ubicacion, empresaId) => {
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { id: parseInt(id) },
  });

  if (!embarcacionExistente) {
    throw new Error("La embarcación no existe.");
  }

  if (empresaId) {
    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa || !empresa.estado) {
      throw new Error("La empresa especificada no existe o está inactiva.");
    }
  }

  const embarcacion = await prisma.embarcacion.update({
    where: { id: parseInt(id) },
    data: {
      nombre,
      datosQrCode,
      ubicacion,
      actualizadoEn: new Date(),
    },
  });

  return embarcacion;
};

export const deleteEmbarcacion = async (id) => {
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { id: parseInt(id) },
  });

  if (!embarcacionExistente) {
    throw new Error("La embarcación no existe.");
  }

  await prisma.embarcacion.update({
    where: { id: parseInt(id) },
    data: { estado: false },
  });
};
