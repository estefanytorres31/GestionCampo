import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoSistema
 */
export const createOrdenTrabajoSistema = async (data) => {
    const { 
        id_orden_trabajo, 
        id_tipo_trabajo_embarcacion_sistema_parte, 
        materiales, 
        proximo_abordaje, 
        fallas, 
        causas, 
        solucion, 
        pendiente, 
        fotos,
        observaciones
    } = data;

    // Validar campos obligatorios
    if (!id_orden_trabajo || !id_tipo_trabajo_embarcacion_sistema_parte) {
        throw new Error("Los campos 'id_orden_trabajo' y 'id_tipo_trabajo_embarcacion_sistema_parte' son obligatorios.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar que la OrdenTrabajo exista y obtener su embarcación
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo },
        select: { id_embarcacion: true }
    });

    if (!ordenTrabajo) {
        throw new Error(`No se encontró la Orden de Trabajo con ID ${id_orden_trabajo}.`);
    }

    // Verificar que el TipoTrabajoEmbarcacionSistemaParte exista y obtener su embarcación
    const ttesp = await prisma.tipoTrabajoEmbarcacionSistemaParte.findUnique({
        where: { id_tipo_trabajo_embarcacion_sistema_parte },
        include: {
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: {
                        include: {
                            embarcacion: true,
                            sistema: true
                        }
                    }
                }
            }
        }
    });

    if (!ttesp) {
        throw new Error(`No se encontró TipoTrabajoEmbarcacionSistemaParte con ID ${id_tipo_trabajo_embarcacion_sistema_parte}.`);
    }

    // Verificar que la embarcación coincida
    if (ordenTrabajo.id_embarcacion !== ttesp.embarcacion_sistema_parte.embarcacion_sistema.embarcacion.id_embarcacion) {
        throw new Error("La embarcación del TipoTrabajoEmbarcacionSistemaParte no coincide con la de la Orden de Trabajo.");
    }

    // Verificar si ya existe la orden
    const existente = await prisma.ordenTrabajoSistema.findFirst({
        where: { 
            id_orden_trabajo, 
            id_tipo_trabajo_embarcacion_sistema_parte 
        }
    });

    if (existente) {
        if (existente.estado !== "inactivo") {
            throw new Error("Ya existe una orden de trabajo para este TipoTrabajoEmbarcacionSistemaParte.");
        } else {
            // Reactivar si estaba inactivo
            const ordenReactivada = await prisma.ordenTrabajoSistema.update({
                where: { id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema },
                data: { 
                    estado: "pendiente", 
                    actualizado_en: fechaActual,
                    materiales: materiales || existente.materiales,
                    proximo_abordaje: proximo_abordaje || existente.proximo_abordaje,
                    observaciones: observaciones || existente.observaciones
                },
                include: { 
                    fotos: true,
                    detalle: true
                },
            });

            // Reactivar detalles si existen
            if (fallas || causas || solucion || pendiente) {
                await prisma.ordenTrabajoSistemaDetalle.upsert({
                    where: { id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema },
                    update: {
                        fallas: fallas || existente.detalle?.fallas,
                        causas: causas || existente.detalle?.causas,
                        solucion: solucion || existente.detalle?.solucion,
                        pendiente: pendiente || existente.detalle?.pendiente,
                        actualizado_en: fechaActual,
                    },
                    create: {
                        id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
                        fallas,
                        causas,
                        solucion,
                        pendiente,
                        creado_en: fechaActual,
                    }
                });
            }

            // Manejar reactivación de fotos si es necesario
            if (fotos && fotos.length > 0) {
                await prisma.ordenTrabajoSistemaFoto.createMany({
                    data: fotos.map((url) => ({
                        id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
                        url,
                        creado_en: fechaActual,
                    })),
                });
            }

            return ordenReactivada;
        }
    }

    // Crear nueva orden de trabajo
    const ordenTrabajoSistema = await prisma.ordenTrabajoSistema.create({
        data: {
            id_orden_trabajo,
            id_tipo_trabajo_embarcacion_sistema_parte,
            estado: "pendiente",
            avance: 0,
            materiales,
            proximo_abordaje,
            observaciones,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
            // Crear detalles si aplican
            detalle: (fallas || causas || solucion || pendiente) ? {
                create: {
                    fallas,
                    causas,
                    solucion,
                    pendiente,
                    creado_en: fechaActual,
                }
            } : undefined,
        },
        include: { 
            fotos: true,
            detalle: true
        },
    });

    // Si hay fotos, asociarlas
    if (fotos && fotos.length > 0) {
        await prisma.ordenTrabajoSistemaFoto.createMany({
            data: fotos.map((url) => ({
                id_orden_trabajo_sistema: ordenTrabajoSistema.id_orden_trabajo_sistema,
                url,
                creado_en: fechaActual,
            })),
        });
    }

    return ordenTrabajoSistema;
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajoSistema = async () => {
    const ordenes = await prisma.ordenTrabajoSistema.findMany({
        where: { estado: { not: "inactivo" } },
        include: { 
            fotos: true,
            detalle: true,
            tipo_trabajo_embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema_parte: {
                        include: {
                            embarcacion_sistema: {
                                include: {
                                    sistema: true,
                                    embarcacion: true
                                }
                            }
                        }
                    },
                    tipo_trabajo: true
                }
            },
            orden_trabajo: {
                include: {
                    tipo_trabajo: true,
                    embarcacion: true,
                    puerto: true,
                    jefe_asigna: true
                }
            }
        },
        orderBy: { creado_en: "desc" },
    });

    if (ordenes.length === 0) {
        throw new Error("No hay órdenes de trabajo disponibles.");
    }

    return ordenes;
};

/**
 * Obtener una OrdenTrabajoSistema por ID
 */
export const getOrdenTrabajoSistemaById = async (id) => {
    const orden = await prisma.ordenTrabajoSistema.findUnique({
        where: { id_orden_trabajo_sistema: parseInt(id) },
        include: { 
            fotos: true,
            detalle: true,
            tipo_trabajo_embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema_parte: {
                        include: {
                            embarcacion_sistema: {
                                include: {
                                    sistema: true,
                                    embarcacion: true
                                }
                            }
                        }
                    },
                    tipo_trabajo: true
                }
            },
            orden_trabajo: {
                include: {
                    tipo_trabajo: true,
                    embarcacion: true,
                    puerto: true,
                    jefe_asigna: true
                }
            }
        },
    });

    if (!orden || orden.estado === "inactivo") {
        throw new Error(`La orden de trabajo con ID ${id} no existe o está inactiva.`);
    }

    return orden;
};

/**
 * Actualizar una OrdenTrabajoSistema
 */
export const updateOrdenTrabajoSistema = async (id, data) => {
    const { 
        avance, 
        materiales, 
        proximo_abordaje, 
        fallas, 
        causas, 
        solucion, 
        pendiente, 
        fotos,
        observaciones
    } = data;

    const fechaActualizacion = getUTCTime(new Date().toISOString());

    // Preparar los datos a actualizar
    const updateData = {
        ...(avance !== undefined && { avance }),
        ...(materiales !== undefined && { materiales }),
        ...(proximo_abordaje !== undefined && { proximo_abordaje }),
        ...(observaciones !== undefined && { observaciones }),
        actualizado_en: fechaActualizacion,
    };

    // Actualizar la orden de trabajo
    let ordenActualizada;
    try {
        ordenActualizada = await prisma.ordenTrabajoSistema.update({
            where: { id_orden_trabajo_sistema: parseInt(id) },
            data: updateData,
            include: { 
                fotos: true,
                detalle: true,
                tipo_trabajo_embarcacion_sistema_parte: {
                    include: {
                        embarcacion_sistema_parte: {
                            include: {
                                embarcacion_sistema: {
                                    include: {
                                        sistema: true,
                                        embarcacion: true
                                    }
                                }
                            }
                        },
                        tipo_trabajo: true
                    }
                },
                orden_trabajo: {
                    include: {
                        tipo_trabajo: true,
                        embarcacion: true,
                        puerto: true,
                        jefe_asigna: true
                    }
                }
            },
        });
    } catch (error) {
        if (error.code === 'P2025') { // Record to update not found
            throw new Error(`La orden de trabajo con ID ${id} no existe o está inactiva.`);
        } else {
            throw error;
        }
    }

    // Actualizar detalles si aplica
    if (fallas || causas || solucion || pendiente) {
        await prisma.ordenTrabajoSistemaDetalle.upsert({
            where: { id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema },
            update: {
                ...(fallas !== undefined && { fallas }),
                ...(causas !== undefined && { causas }),
                ...(solucion !== undefined && { solucion }),
                ...(pendiente !== undefined && { pendiente }),
                actualizado_en: fechaActualizacion,
            },
            create: {
                id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema,
                fallas: fallas || null,
                causas: causas || null,
                solucion: solucion || null,
                pendiente: pendiente || null,
                creado_en: fechaActualizacion,
            }
        });
    }

    // Manejar fotos adicionales si las hay
    if (fotos && fotos.length > 0) {
        await prisma.ordenTrabajoSistemaFoto.createMany({
            data: fotos.map((url) => ({
                id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema,
                url,
                creado_en: fechaActualizacion,
            })),
        });
    }

    return ordenActualizada;
};

/**
 * Desactivar una OrdenTrabajoSistema
 */
export const deleteOrdenTrabajoSistema = async (id) => {
    const orden = await prisma.ordenTrabajoSistema.findUnique({
        where: { id_orden_trabajo_sistema: parseInt(id) }
    });

    if (!orden || orden.estado === "inactivo") {
        throw new Error(`La orden con ID ${id} no existe o ya está inactiva.`);
    }

    return await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema: parseInt(id) },
        data: { estado: "inactivo" },
    });
};
