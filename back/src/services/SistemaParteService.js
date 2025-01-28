import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear una Asociación entre Sistema y Parte
 */
export const createSistemaParte = async (id_sistema, id_parte) => {
    if (isNaN(id_sistema) || isNaN(id_parte)) {
        throw { status: 400, message: "IDs de sistema y parte deben ser números válidos." };
    }

    const sistema = await prisma.sistema.findUnique({ where: { id_sistema } });
    const parte = await prisma.parte.findUnique({ where: { id_parte } });

    if (!sistema || !sistema.estado) {
        throw { status: 404, message: "El sistema no existe o está inactivo." };
    }
    if (!parte || !parte.estado) {
        throw { status: 404, message: "La parte no existe o está inactiva." };
    }

    const relacionExistente = await prisma.sistemaParte.findUnique({
        where: { sistema_parte_unique: { id_sistema, id_parte } },
    });

    if (relacionExistente) {
        throw { status: 400, message: "La relación entre sistema y parte ya existe." };
    }

    const fechaCreacion = getPeruTime();
    const nuevaRelacion = await prisma.sistemaParte.create({
        data: {
            id_sistema,
            id_parte,
            creado_en: fechaCreacion,
            actualizado_en: fechaCreacion,
        },
    });

    return nuevaRelacion;
};

/**
 * Obtener Todas las Partes de un Sistema
 */
export const getPartesBySistema = async (id_sistema) => {
    if (isNaN(id_sistema)) {
        throw { status: 400, message: "El ID del sistema debe ser un número válido." };
    }

    const sistema = await prisma.sistema.findUnique({
        where: { id_sistema },
        include: { sistema_partes: { include: { parte: true } } },
    });

    if (!sistema || !sistema.estado) {
        throw { status: 404, message: "El sistema no existe o está inactivo." };
    }

    return sistema.sistema_partes.map(relacion => relacion.parte);
};

/**
 * Actualizar una Asociación entre Sistema y Parte
 */
export const updateSistemaParte = async (id_sistema_parte, data) => {
    if (isNaN(id_sistema_parte)) {
        throw { status: 400, message: "El ID de la asociación debe ser un número válido." };
    }

    const relacionExistente = await prisma.sistemaParte.findUnique({ where: { id_sistema_parte } });

    if (!relacionExistente) {
        throw { status: 404, message: "La relación entre sistema y parte no existe." };
    }

    const fechaActualizacion = getUTCTime(new Date());
    const relacionActualizada = await prisma.sistemaParte.update({
        where: { id_sistema_parte },
        data: { ...data, actualizado_en: fechaActualizacion },
    });

    return relacionActualizada;
};
