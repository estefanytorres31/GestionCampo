import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoSistema
 */
export const createOrdenTrabajoSistema = async (data) => {
    const { id_orden_trabajo, id_sistema, id_embarcacion_sistema, id_tipo_trabajo_embarcacion_sistema_parte } = data;

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
            return await prisma.ordenTrabajoSistema.update({
                where: { id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema },
                data: { estado: "pendiente", actualizado_en: fechaActual }
            });
        }
    }

    // Crear nueva orden de trabajo
    return await prisma.ordenTrabajoSistema.create({
        data: {
            id_orden_trabajo,
            id_sistema,
            id_embarcacion_sistema,
            id_tipo_trabajo_embarcacion_sistema_parte,
            estado: "pendiente",
            creado_en: fechaActual,
            actualizado_en: fechaActual
        }
    });
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajoSistema = async () => {
    const ordenes = await prisma.ordenTrabajoSistema.findMany({
        where: { estado: { not: "inactivo" } },
        orderBy: { creado_en: "desc" }
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
        where: { id_orden_trabajo_sistema: parseInt(id) }
    });

    if (!orden || orden.estado === "inactivo") {
        throw new Error(`La orden de trabajo con ID ${id} no existe o está inactiva.`);
    }

    return orden;
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
        data: { estado: "inactivo" }
    });
};
