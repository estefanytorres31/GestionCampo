import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Asignar una Parte a un Sistema en una Embarcación
 * Si la asociación existe y está inactiva, la reactiva.
 * Si no existe, la crea.
 * Si existe y está activa, lanza un error.
 */
export const assignSistemaParte = async (id_sistema, id_parte) => {
    if (!id_sistema || !id_parte) {
        throw { status: 400, message: "El ID del sistema y de la parte son obligatorios." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la asociación ya existe
    const asociacionExistente = await prisma.sistemaParte.findUnique({
        where: {
            sistema_parte_unique: {
                id_sistema,
                id_parte
            }
        }
    });

    if (asociacionExistente) {
        if (asociacionExistente.estado) {
            throw { status: 400, message: "Esta parte ya está asignada a este sistema." };
        } else {
            // Reactivar la asociación si estaba desactivada
            return await prisma.sistemaParte.update({
                where: { id_sistema_parte: asociacionExistente.id_sistema_parte },
                data: {
                    estado: true,
                    actualizado_en: fechaActual
                }
            });
        }
    }

    // Crear nueva asociación
    return await prisma.sistemaParte.create({
        data: {
            id_sistema,
            id_parte,
            estado: true,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });
};

/**
 * Obtener todas las Partes de un Sistema que están activas
 */
export const getPartesBySistema = async (id_sistema) => {
    if (!id_sistema) {
        throw { status: 400, message: "El ID del sistema es obligatorio." };
    }

    const partes = await prisma.sistemaParte.findMany({
        where: { 
            id_sistema,
            estado: true 
        },
        include: { parte: true },
    });

    if (!partes.length) {
        throw { status: 404, message: `No se encontraron partes activas para el sistema con ID ${id_sistema}.` };
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

    // Validar que la asociación exista y esté activa
    const asociacion = await prisma.sistemaParte.findUnique({
        where: { id_sistema_parte: parseInt(id_sistema_parte, 10) }
    });

    if (!asociacion || !asociacion.estado) {
        throw { status: 404, message: "La asociación no existe o está inactiva." };
    }

    return await prisma.sistemaParte.update({
        where: { id_sistema_parte: parseInt(id_sistema_parte, 10) },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
    });
};

/**
 * "Eliminar" una Asociación entre Sistema y Parte (Desactivar)
 */
export const deleteSistemaParte = async (id_sistema_parte) => {
    if (!id_sistema_parte) {
        throw { status: 400, message: "El ID de la asociación es obligatorio." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Buscar la relación
    const asociacion = await prisma.sistemaParte.findUnique({
        where: { id_sistema_parte: parseInt(id_sistema_parte, 10) }
    });

    if (!asociacion || !asociacion.estado) {
        throw { status: 404, message: "La asociación ya está desactivada o no existe." };
    }

    // Desactivar la relación en lugar de eliminarla
    const sistemaParteDesactivada = await prisma.sistemaParte.update({
        where: { id_sistema_parte: parseInt(id_sistema_parte, 10) },
        data: { 
            estado: false, 
            actualizado_en: fechaActual 
        },
    });

    return sistemaParteDesactivada;
};

/**
 * Reactivar una Asociación previamente desactivada
 */
export const reactivateSistemaParte = async (id_sistema, id_parte) => {
    if (!id_sistema || !id_parte) {
        throw { status: 400, message: "El ID del sistema y de la parte son obligatorios." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la asociación existe
    const asociacionExistente = await prisma.sistemaParte.findUnique({
        where: {
            sistema_parte_unique: {
                id_sistema,
                id_parte
            }
        }
    });

    if (asociacionExistente) {
        if (asociacionExistente.estado) {
            throw { status: 400, message: "Esta parte ya está asignada y activa en este sistema." };
        } else {
            // Reactivar la asociación
            return await prisma.sistemaParte.update({
                where: { id_sistema_parte: asociacionExistente.id_sistema_parte },
                data: { 
                    estado: true, 
                    actualizado_en: fechaActual 
                },
            });
        }
    }

    throw { status: 404, message: "La asociación no existe." };
};

/**
 * Obtener todas las asociaciones activas con detalles
 */
export const getAllSistemasWithPartes = async () => {
    const asociaciones = await prisma.sistemaParte.findMany({
        where: { estado: true },
        include: {
            sistema: true,
            parte: true,
        },
    });

    if (asociaciones.length === 0) {
        throw { status: 404, message: "No hay asociaciones disponibles." };
    }

    return asociaciones;
};