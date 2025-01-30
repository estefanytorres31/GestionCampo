import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoSistema
 */
export const createOrdenTrabajoSistema = async (data) => {
    const { id_orden_trabajo, id_sistema, id_embarcacion_sistema, id_tipo_trabajo_embarcacion_sistema_parte, materiales, proximo_abordaje, fotos } = data;

    if (!id_orden_trabajo || !id_sistema || !id_embarcacion_sistema || !id_tipo_trabajo_embarcacion_sistema_parte) {
        throw new Error("Todos los campos obligatorios deben estar completos.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

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
        },
    });

    // Si hay fotos, asociarlas
    if (fotos && fotos.length > 0) {
        await prisma.ordenTrabajoSistemaFoto.createMany({
            data: fotos.map((url) => ({
                id_orden_trabajo_sistema: ordenTrabajoSistema.id_orden_trabajo_sistema,
                url,
            })),
        });
    }

    return ordenTrabajoSistema;
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajoSistema = async () => {
    return await prisma.ordenTrabajoSistema.findMany({
        where: { estado: { not: "inactivo" } },
        include: { fotos: true },
        orderBy: { creado_en: "desc" },
    });
};

/**
 * Obtener una OrdenTrabajoSistema por ID
 */
export const getOrdenTrabajoSistemaById = async (id) => {
    return await prisma.ordenTrabajoSistema.findUnique({
        where: { id_orden_trabajo_sistema: parseInt(id) },
        include: { fotos: true },
    });
};

/**
 * Actualizar una OrdenTrabajoSistema
 */
export const updateOrdenTrabajoSistema = async (id, data) => {
    return await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema: parseInt(id) },
        data: {
            ...data,
            actualizado_en: getUTCTime(new Date().toISOString()),
        },
    });
};
