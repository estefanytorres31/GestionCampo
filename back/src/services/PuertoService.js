import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar un puerto
 */
export const createPuerto = async (nombre, ubicacion) => {
    if (!nombre) {
        throw new Error("El nombre del puerto es obligatorio.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si el puerto ya existe (incluyendo los inactivos)
    const puertoExistente = await prisma.puerto.findUnique({
        where: { nombre },
    });

    if (puertoExistente) {
        if (puertoExistente.estado) {
            throw new Error(`El puerto con el nombre "${nombre}" ya existe y está activo.`);
        } else {
            // Reactivar el puerto si estaba inactivo
            return await prisma.puerto.update({
                where: { id_puerto: puertoExistente.id_puerto },
                data: {
                    estado: true,
                    ubicacion: ubicacion || puertoExistente.ubicacion,
                    actualizado_en: fechaActual,
                },
            });
        }
    }

    // Crear nuevo puerto si no existe
    return await prisma.puerto.create({
        data: {
            nombre,
            ubicacion,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });
};

/**
 * Obtener todos los puertos activos
 */
export const getAllPuertos = async () => {
    const puertos = await prisma.puerto.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (puertos.length === 0) {
        throw new Error("No hay puertos disponibles.");
    }

    return puertos;
};

/**
 * Obtener un puerto por su ID
 */
export const getPuertoById = async (id) => {
    if (!id) {
        throw new Error("El ID del puerto es obligatorio.");
    }

    const puerto = await prisma.puerto.findUnique({
        where: { id_puerto: parseInt(id) },
    });

    if (!puerto || !puerto.estado) {
        throw new Error(`El puerto con ID ${id} no existe o está inactivo.`);
    }

    return puerto;
};

/**
 * Actualizar un puerto
 */
export const updatePuerto = async (id, nombre, ubicacion) => {
    if (!id || !nombre) {
        throw new Error("El ID y el nombre del puerto son obligatorios.");
    }

    const puerto = await prisma.puerto.findUnique({
        where: { id_puerto: parseInt(id) },
    });

    if (!puerto || !puerto.estado) {
        throw new Error(`El puerto con ID ${id} no existe o está inactivo.`);
    }

    const fechaActualizacion = getUTCTime(new Date().toISOString());

    return await prisma.puerto.update({
        where: { id_puerto: parseInt(id) },
        data: {
            nombre,
            ubicacion,
            actualizado_en: fechaActualizacion,
        },
    });
};

/**
 * Desactivar un puerto (en lugar de eliminarlo)
 */
export const deletePuerto = async (id) => {
    if (!id) {
        throw new Error("El ID del puerto es obligatorio.");
    }

    const puerto = await prisma.puerto.findUnique({
        where: { id_puerto: parseInt(id) },
    });

    if (!puerto || !puerto.estado) {
        throw new Error(`El puerto con ID ${id} no existe o ya está inactivo.`);
    }

    return await prisma.puerto.update({
        where: { id_puerto: parseInt(id) },
        data: { estado: false },
    });
};
