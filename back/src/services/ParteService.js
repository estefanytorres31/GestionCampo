import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crea o reactiva una nueva parte.
 * @param {string} nombre_parte - Nombre de la parte.
 * @returns {Promise<Object>} - La parte creada o reactivada.
 */
export const createParte = async (nombre_parte) => {
    if (!nombre_parte || typeof nombre_parte !== "string") {
        throw { status: 400, message: "El nombre de la parte es obligatorio y debe ser una cadena." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la parte ya existe (incluyendo las inactivas)
    const parteExistente = await prisma.parte.findUnique({
        where: { nombre_parte },
    });

    if (parteExistente) {
        if (parteExistente.estado) {
            throw { status: 400, message: `La parte con el nombre "${nombre_parte}" ya existe y está activa.` };
        } else {
            // Reactivar la parte si estaba desactivada
            const parteReactivada = await prisma.parte.update({
                where: { id_parte: parteExistente.id_parte },
                data: {
                    estado: true,
                    actualizado_en: fechaActual,
                },
            });

            return parteReactivada;
        }
    }

    // Crear nueva parte si no existe
    const nuevaParte = await prisma.parte.create({
        data: {
            nombre_parte,
            estado: true, // Asegurarse de que la parte se cree activa
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });

    return nuevaParte;
};

/**
 * Obtiene todas las partes activas.
 * @returns {Promise<Array>} - Lista de partes.
 */
export const getAllPartes = async () => {
    const partes = await prisma.parte.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (partes.length === 0) {
        throw { status: 404, message: "No se encontraron partes activas." };
    }

    return partes;
};

/**
 * Obtiene una parte por su ID.
 * @param {number} id_parte - ID de la parte.
 * @returns {Promise<Object>} - La parte encontrada.
 */
export const getParteById = async (id_parte) => {
    const parsedId = parseInt(id_parte, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
        throw { status: 400, message: "El ID proporcionado no es válido." };
    }

    const parte = await prisma.parte.findUnique({
        where: { id_parte: parsedId },
    });

    if (!parte || !parte.estado) {
        throw { status: 404, message: "La parte no existe o está desactivada." };
    }

    return parte;
};

/**
 * Actualiza una parte existente.
 * @param {number} id_parte - ID de la parte a actualizar.
 * @param {string} nombre_parte - Nuevo nombre de la parte.
 * @returns {Promise<Object>} - La parte actualizada.
 */
export const updateParte = async (id_parte, nombre_parte) => {
    const parsedId = parseInt(id_parte, 10);
    if (isNaN(parsedId)) {
        throw { status: 400, message: "El ID proporcionado no es válido." };
    }

    if (!nombre_parte || typeof nombre_parte !== "string") {
        throw { status: 400, message: "El nombre de la parte es obligatorio y debe ser una cadena." };
    }

    const fechaActualizacion = getUTCTime(new Date().toISOString());

    // Verificar si otra parte con el mismo nombre ya está activa
    const otraParte = await prisma.parte.findUnique({
        where: { nombre_parte },
    });

    if (otraParte && otraParte.id_parte !== parsedId && otraParte.estado) {
        throw { status: 400, message: `Otra parte con el nombre "${nombre_parte}" ya existe y está activa.` };
    }

    const parteExistente = await prisma.parte.findUnique({
        where: { id_parte: parsedId },
    });

    if (!parteExistente || !parteExistente.estado) {
        throw { status: 404, message: "La parte no existe o está desactivada." };
    }

    const parteActualizada = await prisma.parte.update({
        where: { id_parte: parsedId },
        data: {
            nombre_parte,
            actualizado_en: fechaActualizacion,
        },
    });

    return parteActualizada;
};

/**
 * Desactiva una parte (eliminación lógica).
 * @param {number} id_parte - ID de la parte a desactivar.
 * @returns {Promise<Object>} - La parte desactivada.
 */
export const deleteParte = async (id_parte) => {
    const parsedId = parseInt(id_parte, 10);
    if (isNaN(parsedId)) {
        throw { status: 400, message: "El ID proporcionado no es válido." };
    }

    const parteExistente = await prisma.parte.findUnique({
        where: { id_parte: parsedId },
    });

    if (!parteExistente || !parteExistente.estado) {
        throw { status: 404, message: "La parte no existe o ya está desactivada." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const parteDesactivada = await prisma.parte.update({
        where: { id_parte: parsedId },
        data: { 
            estado: false, 
            actualizado_en: fechaActual 
        },
    });

    return parteDesactivada;
};