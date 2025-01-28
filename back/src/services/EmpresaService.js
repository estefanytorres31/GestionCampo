import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear una nueva empresa
export const createEmpresa = async (nombre) => {
    try {
        const todayISO = new Date().toISOString();
        const fecha_creacion = getUTCTime(todayISO);

        const nuevaEmpresa = await prisma.empresa.create({
            data: {
                nombre: nombre,
                creado_en: fecha_creacion,
                actualizado_en: fecha_creacion,
            },
        });

        return { status: 201, message: "Empresa creada exitosamente", data: nuevaEmpresa };
    } catch (error) {
        if (error.code === "P2002") {
            return { status: 400, message: "El nombre de la empresa ya existe", error: error.message };
        }
        return { status: 500, message: "Error al crear la empresa", error: error.message };
    }
};

// Obtener todas las empresas
export const getAllEmpresas = async () => {
    try {
        const empresas = await prisma.empresa.findMany({
            where: {
                estado: true, // Solo devuelve las empresas activas
            },
            orderBy: {
                creado_en: "desc", // Orden descendente por fecha de creación
            },
        });

        return { status: 200, message: "Empresas obtenidas exitosamente", data: empresas };
    } catch (error) {
        return { status: 500, message: "Error al obtener las empresas", error: error.message };
    }
};

// Obtener una empresa por su ID
export const getEmpresaById = async (id) => {
    try {
        const empresa = await prisma.empresa.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!empresa || empresa.estado !== true) {
            return { status: 404, message: "Empresa no encontrada o inactiva" };
        }

        return { status: 200, message: "Empresa obtenida exitosamente", data: empresa };
    } catch (error) {
        return { status: 500, message: "Error al obtener la empresa", error: error.message };
    }
};

// Actualizar una empresa
export const updateEmpresa = async (id, nombre) => {
    try {
        const todayISO = new Date().toISOString();
        const fecha_actualizacion = getUTCTime(todayISO);

        const empresaActualizada = await prisma.empresa.update({
            where: {
                id: parseInt(id),
            },
            data: {
                nombre: nombre,
                actualizado_en: fecha_actualizacion,
            },
        });

        return { status: 200, message: "Empresa actualizada exitosamente", data: empresaActualizada };
    } catch (error) {
        if (error.code === "P2025") {
            return { status: 404, message: "Empresa no encontrada para actualizar" };
        } else if (error.code === "P2002") {
            return { status: 400, message: "El nombre de la empresa ya está en uso", error: error.message };
        }
        return { status: 500, message: "Error al actualizar la empresa", error: error.message };
    }
};

// Eliminar (desactivar) una empresa
export const deleteEmpresa = async (id) => {
    try {
        const empresaDesactivada = await prisma.empresa.update({
            where: {
                id: parseInt(id),
            },
            data: {
                estado: false, // Cambia el estado a inactivo
            },
        });

        return { status: 200, message: "Empresa desactivada exitosamente", data: empresaDesactivada };
    } catch (error) {
        if (error.code === "P2025") {
            return { status: 404, message: "Empresa no encontrada para desactivar" };
        }
        return { status: 500, message: "Error al desactivar la empresa", error: error.message };
    }
};
