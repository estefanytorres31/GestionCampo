import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo puerto
export const createPuerto = async (nombre, ubicacion) => {
    try {
        const todayISO = new Date().toISOString();
        const fecha_creacion = getUTCTime(todayISO);

        const nuevoPuerto = await prisma.puerto.create({
            data: {
                nombre: nombre,
                ubicacion: ubicacion,
                creado_en: fecha_creacion,
                actualizado_en: fecha_creacion,
            },
        });

        return { status: 201, message: "Puerto creado exitosamente", data: nuevoPuerto };
    } catch (error) {
        return { status: 500, message: "Error al crear el puerto", error: error.message };
    }
};

// Obtener todos los puertos
export const getAllPuertos = async () => {
    try {
        const puertos = await prisma.puerto.findMany({
            where: {
                estado: true, // Solo devuelve los puertos activos
            },
            orderBy: {
                creado_en: "desc", // Orden descendente por fecha de creación
            },
        });

        return { status: 200, message: "Puertos obtenidos exitosamente", data: puertos };
    } catch (error) {
        return { status: 500, message: "Error al obtener los puertos", error: error.message };
    }
};

// Obtener un puerto por su ID
export const getPuertoById = async (id) => {
    try {
        const puerto = await prisma.puerto.findUnique({
            where: {
                id_puerto: parseInt(id),
            },
        });

        if (!puerto || puerto.estado !== true) {
            return { status: 404, message: "Puerto no encontrado o inactivo" };
        }

        return { status: 200, message: "Puerto obtenido exitosamente", data: puerto };
    } catch (error) {
        return { status: 500, message: "Error al obtener el puerto", error: error.message };
    }
};

// Actualizar un puerto
export const updatePuerto = async (id, nombre, ubicacion) => {
    try {
        const todayISO = new Date().toISOString();
        const fecha_actualizacion = getUTCTime(todayISO);

        const puertoActualizado = await prisma.puerto.update({
            where: {
                id_puerto: parseInt(id),
            },
            data: {
                nombre: nombre,
                ubicacion: ubicacion,
                actualizado_en: fecha_actualizacion,
            },
        });

        return { status: 200, message: "Puerto actualizado exitosamente", data: puertoActualizado };
    } catch (error) {
        if (error.code === "P2025") {
            return { status: 404, message: "Puerto no encontrado para actualizar" };
        }
        return { status: 500, message: "Error al actualizar el puerto", error: error.message };
    }
};

// Eliminar (desactivar) un puerto
export const deletePuerto = async (id) => {
    try {
        const puertoDesactivado = await prisma.puerto.update({
            where: {
                id_puerto: parseInt(id),
            },
            data: {
                estado: false, // Cambia el estado a inactivo
            },
        });

        return { status: 200, message: "Puerto desactivado exitosamente", data: puertoDesactivado };
    } catch (error) {
        if (error.code === "P2025") {
            return { status: 404, message: "Puerto no encontrado para desactivar" };
        }
        return { status: 500, message: "Error al desactivar el puerto", error: error.message };
    }
};
