import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoSistema
 */
export const createOrdenTrabajoSistema = async (data) => {
    const { 
        id_orden_trabajo, 
        id_sistema, 
        id_embarcacion_sistema, 
        id_tipo_trabajo_embarcacion_sistema_parte, 
        materiales, 
        proximo_abordaje, 
        fallas, 
        causas, 
        solucion, 
        pendiente, 
        fotos 
    } = data;

    if (!id_orden_trabajo || !id_sistema || !id_embarcacion_sistema || !id_tipo_trabajo_embarcacion_sistema_parte) {
        throw new Error("Todos los campos obligatorios deben estar completos.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar que la OrdenTrabajo tenga la misma embarcación
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo },
        select: { id_embarcacion: true }
    });

    if (!ordenTrabajo) {
        throw new Error(`No se encontró la Orden de Trabajo con ID ${id_orden_trabajo}.`);
    }

    if (ordenTrabajo.id_embarcacion !== id_embarcacion_sistema) {
        throw new Error("La embarcación del sistema no coincide con la de la orden de trabajo.");
    }

    // Verificar que el sistema pertenezca a `TipoTrabajoEmbarcacionSistemaParte`
    const existeRelacion = await prisma.tipoTrabajoEmbarcacionSistemaParte.findFirst({
        where: {
            id_tipo_trabajo_embarcacion_sistema_parte,
            embarcacion_sistema_parte: {
                id_embarcacion_sistema
            }
        }
    });

    if (!existeRelacion) {
        throw new Error("El sistema no está registrado en TipoTrabajoEmbarcacionSistemaParte para esta embarcación.");
    }

    // Verificar si ya existe la orden
    const existente = await prisma.ordenTrabajoSistema.findFirst({
        where: { id_orden_trabajo, id_sistema, id_tipo_trabajo_embarcacion_sistema_parte }
    });

    if (existente) {
        if (existente.estado !== "inactivo") {
            throw new Error("Ya existe una orden de trabajo para este sistema.");
        } else {
            // Reactivar si estaba inactivo
            const ordenReactivada = await prisma.ordenTrabajoSistema.update({
                where: { id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema },
                data: { 
                    estado: "pendiente", 
                    actualizado_en: fechaActual,
                    materiales: materiales || existente.materiales,
                    proximo_abordaje: proximo_abordaje || existente.proximo_abordaje
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
            id_sistema,
            id_embarcacion_sistema,
            id_tipo_trabajo_embarcacion_sistema_parte,
            estado: "pendiente",
            avance: 0,
            materiales,
            proximo_abordaje,
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
            detalle: true
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
            detalle: true
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
        fotos 
    } = data;

    const fechaActualizacion = getUTCTime(new Date().toISOString());

    // Actualizar la orden de trabajo
    const ordenActualizada = await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema: parseInt(id) },
        data: {
            avance: avance !== undefined ? avance : undefined,
            materiales: materiales !== undefined ? materiales : undefined,
            proximo_abordaje: proximo_abordaje !== undefined ? proximo_abordaje : undefined,
            actualizado_en: fechaActualizacion,
        },
        include: { 
            fotos: true,
            detalle: true
        },
    });

    // Actualizar detalles si aplica
    if (fallas || causas || solucion || pendiente) {
        await prisma.ordenTrabajoSistemaDetalle.upsert({
            where: { id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema },
            update: {
                fallas: fallas !== undefined ? fallas : undefined,
                causas: causas !== undefined ? causas : undefined,
                solucion: solucion !== undefined ? solucion : undefined,
                pendiente: pendiente !== undefined ? pendiente : undefined,
                actualizado_en: fechaActualizacion,
            },
            create: {
                id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema,
                fallas,
                causas,
                solucion,
                pendiente,
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
