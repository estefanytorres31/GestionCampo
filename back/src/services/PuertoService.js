import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPuerto = async (nombre, ubicacion) => {
  const puertoExistente = await prisma.puerto.findUnique({
    where: { nombre },
  });

  if (puertoExistente) {
    throw new Error("Ya existe un puerto con ese nombre.");
  }

  const puerto = await prisma.puerto.create({
    data: {
      nombre,
      ubicacion,
    },
  });

  return puerto;
};

export const getAllPuertos = async () => {
  const puertos = await prisma.puerto.findMany({
    where: { estado: true },
    orderBy: { nombre: "asc" },
  });
  return puertos;
};

export const getPuertoById = async (id) => {
  const puerto = await prisma.puerto.findUnique({
    where: { id: parseInt(id) },
  });

  if (!puerto) {
    throw new Error("El puerto no existe.");
  }

  return puerto;
};

export const updatePuerto = async (id, nombre, ubicacion) => {
  const puertoExistente = await prisma.puerto.findUnique({
    where: { id: parseInt(id) },
  });

  if (!puertoExistente) {
    throw new Error("El puerto no existe.");
  }

  const puertoActualizado = await prisma.puerto.update({
    where: { id: parseInt(id) },
    data: {
      nombre,
      ubicacion,
      actualizadoEn: new Date(),
    },
  });

  return puertoActualizado;
};

export const deletePuerto = async (id) => {
  const puertoExistente = await prisma.puerto.findUnique({
    where: { id: parseInt(id) },
  });

  if (!puertoExistente) {
    throw new Error("El puerto no existe.");
  }

  await prisma.puerto.update({
    where: { id: parseInt(id) },
    data: { estado: false },
  });
};
