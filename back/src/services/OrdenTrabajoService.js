import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o Reactivar una relación TipoTrabajoEmbarcacionSistemaParte
 * @param {number} id_tipo_trabajo - ID del tipo de trabajo
 * @param {number} id_embarcacion_sistema_parte - ID de la relación embarcación-sistema-parte
 * @returns {Promise<Object>} - La relación creada o reactivada
 */
export const createOrReactivateTipoTrabajoESP = async (id_tipo_trabajo, id_embarcacion_sistema_parte) => {
    if (!id_tipo_trabajo || !id_embarcacion_sistema_parte) {
        throw { status: 400, message: "El ID del tipo de trabajo y de la relación embarcación-sistema-parte son obligatorios." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la relación ya existe
    const relacionExistente = await prisma.tipoTrabajoEmbarcacionSistemaParte.findUnique({
        where: { unq_tt_esp: { id_tipo_trabajo, id_embarcacion_sistema_parte } }
    });

    if (relacionExistente) {
        if (relacionExistente.estado) {
            throw { status: 400, message: "Esta relación ya está activa." };
        } else {
            // Reactivar la relación si estaba desactivada
            return await prisma.tipoTrabajoEmbarcacionSistemaParte.update({
                where: { id_tipo_trabajo_embarcacion_sistema_parte: relacionExistente.id_tipo_trabajo_embarcacion_sistema_parte },
                data: {
                    estado: true,
                    actualizado_en: fechaActual,
                }
            });
        }
    }

    // Crear nueva relación
    const nuevaRelacion = await prisma.tipoTrabajoEmbarcacionSistemaParte.create({
        data: {
            id_tipo_trabajo,
            id_embarcacion_sistema_parte,
            estado: true,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        }
    });

    return nuevaRelacion;
};

/**
 * Obtener todas las relaciones activas de TipoTrabajoEmbarcacionSistemaParte
 * @returns {Promise<Array>} - Lista de relaciones activas
 */
export const getAllTipoTrabajoESP = async () => {
    const relaciones = await prisma.tipoTrabajoEmbarcacionSistemaParte.findMany({
        where: { estado: true },
        include: {
            tipo_trabajo: true,
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            embarcacion: true,
                            sistema: true,
                        }
                    },
                    parte: true,
                }
            }
        },
        orderBy: { creado_en: "desc" },
    });

    if (relaciones.length === 0) {
        throw { status: 404, message: "No hay relaciones disponibles." };
    }

    return relaciones;
};

/**
 * Obtener una relación por su ID
 * @param {number} id - ID de la relación
 * @returns {Promise<Object>} - La relación encontrada
 */
export const getTipoTrabajoESPById = async (id) => {
    if (!id) {
        throw { status: 400, message: "El ID de la relación es obligatorio." };
    }

    const relacion = await prisma.tipoTrabajoEmbarcacionSistemaParte.findUnique({
        where: { id_tipo_trabajo_embarcacion_sistema_parte: parseInt(id, 10) },
        include: {
            tipo_trabajo: true,
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            embarcacion: true,
                            sistema: true,
                        }
                    },
                    parte: true,
                }
            }
        }
    });

    if (!relacion || !relacion.estado) {
        throw { status: 404, message: `La relación con ID ${id} no existe o está inactiva.` };
    }

    return relacion;
};

/**
 * Actualizar una relación TipoTrabajoEmbarcacionSistemaParte
 * @param {number} id - ID de la relación
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} - La relación actualizada
 */
export const updateTipoTrabajoESP = async (id, data) => {
    if (!id) {
        throw { status: 400, message: "El ID de la relación es obligatorio." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Opcional: Validar los campos a actualizar
    // Por ejemplo, si se intenta cambiar el id_tipo_trabajo o id_embarcacion_sistema_parte,
    // deberías verificar que las nuevas relaciones existan y estén activas.

    return await prisma.tipoTrabajoEmbarcacionSistemaParte.update({
        where: { id_tipo_trabajo_embarcacion_sistema_parte: parseInt(id, 10) },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
        include: {
            tipo_trabajo: true,
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            embarcacion: true,
                            sistema: true,
                        }
                    },
                    parte: true,
                }
            }
        }
    });
};

/**
 * Desactivar una relación TipoTrabajoEmbarcacionSistemaParte (Soft Delete)
 * @param {number} id - ID de la relación
 * @returns {Promise<Object>} - La relación desactivada
 */
export const desactivarTipoTrabajoESP = async (id) => {
    if (!id) {
        throw { status: 400, message: "El ID de la relación es obligatorio." };
    }

    const relacion = await prisma.tipoTrabajoEmbarcacionSistemaParte.findUnique({
        where: { id_tipo_trabajo_embarcacion_sistema_parte: parseInt(id, 10) }
    });

    if (!relacion || !relacion.estado) {
        throw { status: 404, message: "La relación ya está desactivada o no existe." };
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const relacionDesactivada = await prisma.tipoTrabajoEmbarcacionSistemaParte.update({
        where: { id_tipo_trabajo_embarcacion_sistema_parte: parseInt(id, 10) },
        data: { estado: false, actualizado_en: fechaActual },
        include: {
            tipo_trabajo: true,
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            embarcacion: true,
                            sistema: true,
                        }
                    },
                    parte: true,
                }
            }
        }
    });

    return relacionDesactivada;
};