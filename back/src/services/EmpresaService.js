// services/EmpresaService.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEmpresa = async (nombre, razonSocial) => {
  // Verificar si ya existe una empresa con el mismo nombre
  const empresaExistente = await prisma.empresa.findUnique({
    where: { nombre },
  });

  if (empresaExistente) {
    throw new Error("Ya existe una empresa con ese nombre.");
  }

  // Crear una nueva empresa
  const empresa = await prisma.empresa.create({
    data: {
      nombre,
      razonSocial,
    },
  });

  return empresa;
};

export const getAllEmpresas = async () => {
  const empresas = await prisma.empresa.findMany({
    where: { estado: true },
    orderBy: { nombre: "asc" },
    include: {
      embarcaciones: {
        include: {
          embarcacion: true,
        },
      },
    },
  });
  return empresas;
};

export const getEmpresaById = async (id) => {
  const empresa = await prisma.empresa.findUnique({
    where: { id: parseInt(id) },
    include: {
      embarcaciones: {
        include: {
          embarcacion: true,
        },
      },
    },
  });

  if (!empresa) {
    throw new Error("La empresa no existe.");
  }

  return empresa;
};

export const updateEmpresa = async (id, nombre, razonSocial) => {
  // Verificar si la empresa existe
  const empresaExistente = await prisma.empresa.findUnique({
    where: { id: parseInt(id) },
  });

  if (!empresaExistente) {
    throw new Error("La empresa no existe.");
  }

  // Actualizar la empresa
  const empresaActualizada = await prisma.empresa.update({
    where: { id: parseInt(id) },
    data: {
      nombre,
      razonSocial,
      actualizadoEn: new Date(),
    },
  });

  return empresaActualizada;
};

export const deleteEmpresa = async (id) => {
  // Verificar si la empresa existe
  const empresaExistente = await prisma.empresa.findUnique({
    where: { id: parseInt(id) },
  });

  if (!empresaExistente) {
    throw new Error("La empresa no existe.");
  }

  // Realizar un soft delete (desactivar la empresa)
  await prisma.empresa.update({
    where: { id: parseInt(id) },
    data: { estado: false },
  });
};
