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

    // Verificar si la asociación ya existe
    const asociacionExistente = await prisma.embarcacionSistemaParte.findUnique({
        where: {
            embarcacion_sistema_parte_unique: {
                id_embarcacion_sistema,
                id_parte
            }
        }
    });

    if (asociacionExistente) {
        if (asociacionExistente.estado) {
            throw { status: 400, message: "Esta parte ya está asignada a este sistema en la embarcación." };
        } else {
            // Reactivar la relación si estaba desactivada
            return await prisma.embarcacionSistemaParte.update({
                where: { id_embarcacion_sistema_parte: asociacionExistente.id_embarcacion_sistema_parte },
                data: {
                    estado: true,
                    actualizado_en: fechaActual
                }
            });
        }
    }

    // Crear nueva asociación
    return await prisma.embarcacionSistemaParte.create({
        data: {
            id_embarcacion_sistema,
            id_parte,
            estado: true,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });
};

/**
 * Obtener Todas las Partes de un Sistema en una Embarcación
 */
export const getPartesByEmbarcacionSistema = async (id_embarcacion_sistema) => {
    if (!id_embarcacion_sistema) {
        throw { status: 400, message: "El ID de la embarcación-sistema es obligatorio." };
    }

    const partes = await prisma.embarcacionSistemaParte.findMany({
        where: { id_embarcacion_sistema, estado: true },
        include: { parte: true },
    });

    if (!partes.length) {
        throw { status: 404, message: `No se encontraron partes activas para la embarcación-sistema con ID ${id_embarcacion_sistema}.` };
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

    return await prisma.embarcacionSistemaParte.update({
        where: { id_embarcacion_sistema_parte },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
    });
};

/**
 * "Eliminar" una Asociación entre Embarcación, Sistema y Parte (Desactivar)
 */
export const deleteEmbarcacionSistemaParte = async (id_embarcacion_sistema_parte) => {
    if (!id_embarcacion_sistema_parte) {
        throw { status: 400, message: "El ID de la asociación es obligatorio." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Buscar la relación
    const asociacion = await prisma.embarcacionSistemaParte.findUnique({
        where: { id_embarcacion_sistema_parte }
    });

    if (!asociacion || !asociacion.estado) {
        throw { status: 404, message: "La asociación ya está desactivada o no existe." };
    }

    // Desactivar la relación en lugar de eliminarla
    return await prisma.embarcacionSistemaParte.update({
        where: { id_embarcacion_sistema_parte },
        data: { estado: false, actualizado_en: fechaActual },
    });
};
