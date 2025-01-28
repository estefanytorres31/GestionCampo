import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear una Asociación entre Sistema y Parte
 */
export const createSistemaParte = async (id_sistema, id_parte) => {
    if (!id_sistema || !id_parte) {
        throw { status: 400, message: "El ID del sistema y de la parte son obligatorios." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const sistemaParte = await prisma.sistemaParte.create({
        data: {
            id_sistema,
            id_parte,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });

    return sistemaParte;
};

/**
 * Obtener Todas las Partes de un Sistema
 */
export const getPartesBySistema = async (id_sistema) => {
    if (!id_sistema) {
        throw { status: 400, message: "El ID del sistema es obligatorio." };
    }

    const partes = await prisma.sistemaParte.findMany({
        where: { id_sistema },
        include: { parte: true },
    });

    if (!partes.length) {
        throw { status: 404, message: `No se encontraron partes para el sistema con ID ${id_sistema}.` };
    }

    return partes;
};

/**
 * Actualizar una Asociación entre Sistema y Parte
 */
export const updateSistemaParte = async (id_sistema_parte, data) => {
    if (!id_sistema_parte) {
        throw { status: 400, message: "El ID de la asociación es obligatorio." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const sistemaParte = await prisma.sistemaParte.update({
        where: { id_sistema_parte },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
    });

    return sistemaParte;
};