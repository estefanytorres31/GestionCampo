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

    // Verificar si el Tipo de Trabajo existe
    const tipoTrabajo = await prisma.tipoTrabajo.findUnique({
        where: { id_tipo_trabajo },
    });

    if (!tipoTrabajo) {
        throw { status: 404, message: `Tipo de Trabajo con ID ${id_tipo_trabajo} no encontrado.` };
    }

    // Verificar si la relación EmbarcacionSistemaParte existe
    const embarcacionSistemaParte = await prisma.embarcacionSistemaParte.findUnique({
        where: { id_embarcacion_sistema_parte },
    });

    if (!embarcacionSistemaParte) {
        throw { status: 404, message: `Relación Embarcación-Sistema-Parte con ID ${id_embarcacion_sistema_parte} no encontrada.` };
    }

    // Verificar si la relación TipoTrabajoEmbarcacionSistemaParte ya existe utilizando el índice único
    const relacionExistente = await prisma.tipoTrabajoEmbarcacionSistemaParte.findUnique({
        where: {
            unq_tt_esp: {
                id_tipo_trabajo,
                id_embarcacion_sistema_parte,
            },
        },
    });

    if (relacionExistente) {
        if (relacionExistente.estado) {
            throw { status: 400, message: "Esta relación ya está activa." };
        } else {
            // Reactivar la relación si estaba desactivada
            try {
                return await prisma.tipoTrabajoEmbarcacionSistemaParte.update({
                    where: { id_tipo_trabajo_embarcacion_sistema_parte: relacionExistente.id_tipo_trabajo_embarcacion_sistema_parte },
                    data: {
                        estado: true,
                        actualizado_en: fechaActual,
                    },
                });
            } catch (error) {
                handlePrismaError(error);
            }
        }
    }

    // Crear nueva relación
    try {
        const nuevaRelacion = await prisma.tipoTrabajoEmbarcacionSistemaParte.create({
            data: {
                id_tipo_trabajo,
                id_embarcacion_sistema_parte,
                estado: true,
                creado_en: fechaActual,
                actualizado_en: fechaActual,
            },
        });

        return nuevaRelacion;
    } catch (error) {
        handlePrismaError(error);
    }
};

/**
 * Manejar errores de Prisma y lanzar errores personalizados
 * @param {Object} error - Error de Prisma
 */
const handlePrismaError = (error) => {
    if (error.code === 'P2002') { // Unique constraint failed
        throw { status: 400, message: "Ya existe una relación con estos valores." };
    } else if (error.code === 'P2003') { // Foreign key constraint failed
        throw { status: 400, message: "Claves foráneas inválidas proporcionadas." };
    } else {
        throw { status: 500, message: "Error interno del servidor." };
    }
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
                        },
                    },
                    parte: true,
                },
            },
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
                        },
                    },
                    parte: true,
                },
            },
        },
    });

    if (!relacion || !relacion.estado) {
        throw { status: 404, message: `La relación con ID ${id} no existe o está inactiva.` };
    }

    return relacion;
};

/**
 * Obtener Sistemas por Tipo de Trabajo y Embarcación (Sin Partes)
 * @param {number} id_tipo_trabajo - ID del Tipo de Trabajo
 * @param {number} id_embarcacion - ID de la Embarcación
 * @returns {Promise<Array>} - Lista de Sistemas
 */
export const getSistemasPorTipoTrabajoEmbarcacion = async (id_tipo_trabajo, id_embarcacion) => {
    const relaciones = await prisma.tipoTrabajoEmbarcacionSistemaParte.findMany({
        where: {
            id_tipo_trabajo: id_tipo_trabajo,
            embarcacion_sistema_parte: {
                embarcacion_sistema: {
                    id_embarcacion: id_embarcacion
                }
            }
        },
        include: {
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            sistema: true
                        }
                    }
                }
            }
        }
    });

    // Extraer sistemas únicos
    const sistemasMap = {};

    relaciones.forEach(relacion => {
        const sistema = relacion.embarcacion_sistema_parte.embarcacion_sistema.sistema;
        if (!sistemasMap[sistema.id_sistema]) {
            sistemasMap[sistema.id_sistema] = {
                id_sistema: sistema.id_sistema,
                nombre_sistema: sistema.nombre_sistema
            };
        }
    });

    return Object.values(sistemasMap);
};

/**
 * Obtener Sistemas y Partes por Tipo de Trabajo y Embarcación
 * @param {number} id_tipo_trabajo - ID del Tipo de Trabajo
 * @param {number} id_embarcacion - ID de la Embarcación
 * @returns {Promise<Array>} - Lista de Sistemas con sus Partes
 */
export const getSistemasPartesPorTipoTrabajoEmbarcacion = async (id_tipo_trabajo, id_embarcacion) => {
    const relaciones = await prisma.tipoTrabajoEmbarcacionSistemaParte.findMany({
        where: {
            id_tipo_trabajo: id_tipo_trabajo,
            embarcacion_sistema_parte: {
                embarcacion_sistema: {
                    id_embarcacion: id_embarcacion
                }
            }
        },
        include: {
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            sistema: true
                        }
                    },
                    parte: true
                }
            }
        }
    });

    // Organizar los datos por sistema
    const sistemasMap = {};

    relaciones.forEach(relacion => {
        const sistema = relacion.embarcacion_sistema_parte.embarcacion_sistema.sistema;
        const parte = relacion.embarcacion_sistema_parte.parte;

        if (!sistemasMap[sistema.id_sistema]) {
            sistemasMap[sistema.id_sistema] = {
                id_sistema: sistema.id_sistema,
                nombre_sistema: sistema.nombre_sistema,
                partes: []
            };
        }

        sistemasMap[sistema.id_sistema].partes.push({
            id_parte: parte.id_parte,
            nombre_parte: parte.nombre_parte
        });
    });

    return Object.values(sistemasMap);
};

/**
 * Obtener Partes por Sistema, Tipo de Trabajo y Embarcación
 * @param {number} id_tipo_trabajo - ID del Tipo de Trabajo
 * @param {number} id_embarcacion - ID de la Embarcación
 * @param {number} id_sistema - ID del Sistema
 * @returns {Promise<Array>} - Lista de Partes
 */
export const getPartesPorSistemaTipoTrabajoEmbarcacion = async (id_tipo_trabajo, id_embarcacion, id_sistema) => {
    const relaciones = await prisma.tipoTrabajoEmbarcacionSistemaParte.findMany({
        where: {
            id_tipo_trabajo: id_tipo_trabajo,
            embarcacion_sistema_parte: {
                embarcacion_sistema: {
                    id_embarcacion: id_embarcacion,
                    sistema: {
                        id_sistema: id_sistema
                    }
                }
            }
        },
        include: {
            embarcacion_sistema_parte: {
                include: {
                    parte: true
                }
            }
        }
    });

    // Extraer partes únicas
    const partesMap = {};

    relaciones.forEach(relacion => {
        const parte = relacion.embarcacion_sistema_parte.parte;
        if (!partesMap[parte.id_parte]) {
            partesMap[parte.id_parte] = {
                id_parte: parte.id_parte,
                nombre_parte: parte.nombre_parte
            };
        }
    });

    return Object.values(partesMap);
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
                        },
                    },
                    parte: true,
                },
            },
        },
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
        where: { id_tipo_trabajo_embarcacion_sistema_parte: parseInt(id, 10) },
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
                        },
                    },
                    parte: true,
                },
            },
        },
    });

    return relacionDesactivada;
};