import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo puerto
export const createPuerto = async (nombre, ubicacion) => {
    if (!nombre) {
        throw new Error("El nombre del puerto es obligatorio.");
    }

    const puertoExistente = await prisma.puerto.findUnique({
        where: { nombre },
    });

    if (puertoExistente) {
        throw new Error(`El puerto con el nombre "${nombre}" ya existe.`);
    }

    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const nuevoPuerto = await prisma.puerto.create({
        data: {
            nombre,
            ubicacion,
            creado_en: fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    return nuevoPuerto;
};

// Obtener todos los puertos
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

// Obtener un puerto por su ID
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

// Actualizar un puerto
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

    const todayISO = new Date().toISOString();
    const fecha_actualizacion = getUTCTime(todayISO);

    const puertoActualizado = await prisma.puerto.update({
        where: { id_puerto: parseInt(id) },
        data: {
            nombre,
            ubicacion,
            actualizado_en: fecha_actualizacion,
        },
    });

    return puertoActualizado;
};

// Eliminar (desactivar) un puerto
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

    const puertoDesactivado = await prisma.puerto.update({
        where: { id_puerto: parseInt(id) },
        data: { estado: false },
    });

    return puertoDesactivado;
};
