import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear una nueva empresa
export const createEmpresa = async (nombre) => {
    if (!nombre) {
        throw new Error("El nombre de la empresa es obligatorio.");
    }

    const empresaExistente = await prisma.empresa.findUnique({
        where: { nombre },
    });

    if (empresaExistente) {
        throw new Error(`La empresa con el nombre "${nombre}" ya existe.`);
    }

    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const nuevaEmpresa = await prisma.empresa.create({
        data: {
            nombre,
            creado_en: fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    return nuevaEmpresa;
};

// Obtener todas las empresas
export const getAllEmpresas = async () => {
    const empresas = await prisma.empresa.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (empresas.length === 0) {
        throw new Error("No hay empresas disponibles.");
    }

    return empresas;
};

// Obtener una empresa por su ID
export const getEmpresaById = async (id) => {
    if (!id) {
        throw new Error("El ID de la empresa es obligatorio.");
    }

    const empresa = await prisma.empresa.findUnique({
        where: { id: parseInt(id) },
    });

    if (!empresa || !empresa.estado) {
        throw new Error(`La empresa con ID ${id} no existe o está inactiva.`);
    }

    return empresa;
};

// Actualizar una empresa
export const updateEmpresa = async (id, nombre) => {
    if (!id || !nombre) {
        throw new Error("El ID y el nombre de la empresa son obligatorios.");
    }

    const empresa = await prisma.empresa.findUnique({
        where: { id: parseInt(id) },
    });

    if (!empresa || !empresa.estado) {
        throw new Error(`La empresa con ID ${id} no existe o está inactiva.`);
    }

    const todayISO = new Date().toISOString();
    const fecha_actualizacion = getUTCTime(todayISO);

    const empresaActualizada = await prisma.empresa.update({
        where: { id: parseInt(id) },
        data: {
            nombre,
            actualizado_en: fecha_actualizacion,
        },
    });

    return empresaActualizada;
};

// Eliminar (desactivar) una empresa
export const deleteEmpresa = async (id) => {
    if (!id) {
        throw new Error("El ID de la empresa es obligatorio.");
    }

    const empresa = await prisma.empresa.findUnique({
        where: { id: parseInt(id) },
    });

    if (!empresa || !empresa.estado) {
        throw new Error(`La empresa con ID ${id} no existe o ya está inactiva.`);
    }

    const empresaDesactivada = await prisma.empresa.update({
        where: { id: parseInt(id) },
        data: { estado: false },
    });

    return empresaDesactivada;
};
