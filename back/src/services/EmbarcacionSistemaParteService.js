import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Asignar una Parte a un Sistema en una Embarcación
 */
export const assignParteToEmbarcacionSistema = async (id_embarcacion_sistema, id_parte) => {
    if (!id_embarcacion_sistema || !id_parte) {
        throw { status: 400, message: "El ID de la embarcación-sistema y de la parte son obligatorios." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const embarcacionSistemaParte = await prisma.embarcacionSistemaParte.create({
        data: {
            id_embarcacion_sistema,
            id_parte,
            estado: true,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });

    return embarcacionSistemaParte;
};

/**
 * Obtener Todas las Partes de un Sistema en una Embarcación
 */
export const getPartesByEmbarcacionSistema = async (id_embarcacion_sistema) => {
    if (!id_embarcacion_sistema) {
        throw { status: 400, message: "El ID de la embarcación-sistema es obligatorio." };
    }

    const partes = await prisma.embarcacionSistemaParte.findMany({
        where: { id_embarcacion_sistema },
        include: { parte: true },
    });

    if (!partes.length) {
        throw { status: 404, message: `No se encontraron partes para la relación embarcación-sistema con ID ${id_embarcacion_sistema}.` };
    }

    return partes;
};

/**
 * Actualizar una Asociación entre Embarcación, Sistema y Parte
 */
export const updateEmbarcacionSistemaParte = async (id_embarcacion_sistema_parte, data) => {
    if (!id_embarcacion_sistema_parte) {
        throw { status: 400, message: "El ID de la asociación es obligatorio." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const embarcacionSistemaParte = await prisma.embarcacionSistemaParte.update({
        where: { id_embarcacion_sistema_parte },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
    });

    return embarcacionSistemaParte;
};

/**
 * Eliminar una Asociación entre Embarcación, Sistema y Parte
 */
export const deleteEmbarcacionSistemaParte = async (id_embarcacion_sistema_parte) => {
    if (!id_embarcacion_sistema_parte) {
        throw { status: 400, message: "El ID de la asociación es obligatorio." };
    }

    const embarcacionSistemaParte = await prisma.embarcacionSistemaParte.delete({
        where: { id_embarcacion_sistema_parte },
    });

    return embarcacionSistemaParte;
};