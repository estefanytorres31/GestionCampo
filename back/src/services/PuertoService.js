import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear un nuevo puerto.
 * @param {string} nombre - Nombre del puerto.
 * @param {string} [ubicacion] - Ubicación del puerto.
 * @returns {Promise<Object>} - Objeto del puerto creado.
 * @throws {Error} - Si ocurre un error durante la creación.
 */
export const createPuerto = async (nombre, ubicacion) => {
    try {
        const todayISO = new Date().toISOString();
        const fecha_creacion = getUTCTime(todayISO);

        // Verificar si el nombre ya existe
        const puertoExistente = await prisma.puerto.findUnique({
            where: { nombre },
        });

        if (puertoExistente) {
            const error = new Error("El nombre del puerto ya está en uso.");
            error.code = "DUPLICATE_NOMBRE";
            throw error;
        }

        const nuevoPuerto = await prisma.puerto.create({
            data: {
                nombre,
                ubicacion,
                creado_en: fecha_creacion,
                actualizado_en: fecha_creacion,
            },
        });

        return nuevoPuerto;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener todos los puertos activos.
 * @returns {Promise<Array>} - Lista de puertos.
 * @throws {Error} - Si ocurre un error durante la consulta.
 */
export const getAllPuertos = async () => {
    try {
        const puertos = await prisma.puerto.findMany({
            where: { estado: true },
            orderBy: { creado_en: "desc" },
        });

        return puertos;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener un puerto por su ID.
 * @param {number} id - ID del puerto.
 * @returns {Promise<Object>} - Objeto del puerto.
 * @throws {Error} - Si el puerto no se encuentra o está inactivo.
 */
export const getPuertoById = async (id) => {
    try {
        const puerto = await prisma.puerto.findUnique({
            where: { id_puerto: id },
        });

        if (!puerto || !puerto.estado) {
            const error = new Error("Puerto no encontrado o inactivo.");
            error.code = "NOT_FOUND";
            throw error;
        }

        return puerto;
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un puerto existente.
 * @param {number} id - ID del puerto.
 * @param {string} nombre - Nuevo nombre del puerto.
 * @param {string} [ubicacion] - Nueva ubicación del puerto.
 * @returns {Promise<Object>} - Objeto del puerto actualizado.
 * @throws {Error} - Si el puerto no se encuentra o el nombre ya está en uso.
 */
export const updatePuerto = async (id, nombre, ubicacion) => {
    try {
        // Verificar si el puerto existe
        const puertoExistente = await prisma.puerto.findUnique({
            where: { id_puerto: id },
        });

        if (!puertoExistente || !puertoExistente.estado) {
            const error = new Error("Puerto no encontrado o inactivo.");
            error.code = "NOT_FOUND";
            throw error;
        }

        // Verificar si el nuevo nombre está en uso por otro puerto
        const puertoNombre = await prisma.puerto.findUnique({
            where: { nombre },
        });

        if (puertoNombre && puertoNombre.id_puerto !== id) {
            const error = new Error("El nombre del puerto ya está en uso.");
            error.code = "DUPLICATE_NOMBRE";
            throw error;
        }

        const todayISO = new Date().toISOString();
        const fecha_actualizacion = getUTCTime(todayISO);

        const puertoActualizado = await prisma.puerto.update({
            where: { id_puerto: id },
            data: {
                nombre,
                ubicacion,
                actualizado_en: fecha_actualizacion,
            },
        });

        return puertoActualizado;
    } catch (error) {
        throw error;
    }
};

/**
 * Desactivar (eliminar) un puerto.
 * @param {number} id - ID del puerto.
 * @returns {Promise<Object>} - Objeto del puerto desactivado.
 * @throws {Error} - Si el puerto no se encuentra.
 */
export const deletePuerto = async (id) => {
    try {
        // Verificar si el puerto existe
        const puertoExistente = await prisma.puerto.findUnique({
            where: { id_puerto: id },
        });

        if (!puertoExistente || !puertoExistente.estado) {
            const error = new Error("Puerto no encontrado o ya está desactivado.");
            error.code = "NOT_FOUND";
            throw error;
        }

        const puertoDesactivado = await prisma.puerto.update({
            where: { id_puerto: id },
            data: { estado: false },
        });

        return puertoDesactivado;
    } catch (error) {
        throw error;
    }
};
