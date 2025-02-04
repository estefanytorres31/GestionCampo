import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoParte
 */
export const createOrdenTrabajoParte = async (data) => {
    const { id_orden_trabajo_sistema, id_parte, estado, comentario } = data;

    // Validar campos obligatorios
    if (!id_orden_trabajo_sistema || !id_parte) {
        throw new Error("Los campos 'id_orden_trabajo_sistema' y 'id_parte' son obligatorios.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la combinación ya existe
    const existente = await prisma.ordenTrabajoParte.findFirst({
        where: { id_orden_trabajo_sistema, id_parte }
    });

    if (existente) {
        if (existente.estado !== "inactivo") {
            throw new Error("Ya existe una orden de trabajo parte para este sistema y parte.");
        } else {
            // Reactivar si estaba inactivo
            return await prisma.ordenTrabajoParte.update({
                where: { id_orden_trabajo_parte: existente.id_orden_trabajo_parte },
                data: { 
                    estado: estado || "pendiente", 
                    comentario,
                    actualizado_en: fechaActual
                },
            });
        }
    }

    // Crear nueva orden de trabajo parte
    return await prisma.ordenTrabajoParte.create({
        data: {
            id_orden_trabajo_sistema,
            id_parte,
            estado: estado || "pendiente",
            comentario,
            creado_en: fechaActual,
            actualizado_en: fechaActual
        }
    });
};
export const getAllOrdenesTrabajoParte = async (filters) => {
    const whereClause = {
      estado: filters.estado || { not: "inactivo" },
      ...(filters.id_orden_trabajo_sistema && { id_orden_trabajo_sistema: parseInt(filters.id_orden_trabajo_sistema) }),
      ...(filters.id_parte && { id_parte: parseInt(filters.id_parte) }),
    };
  
    const ordenes = await prisma.ordenTrabajoParte.findMany({
      where: whereClause,
      include: {
        orden_trabajo_sistema: {
          select: { id_orden_trabajo_sistema: true, estado: true },
        },
        parte: {
          select: { id_parte: true, nombre_parte: true }, // Usa el campo REAL de la BD
        },
      },
      orderBy: { creado_en: "desc" },
    });
  
    if (ordenes.length === 0) {
      throw new Error("No hay órdenes de trabajo parte disponibles con los criterios especificados.");
    }
  
    return ordenes;
  };

/**
 * Actualizar una OrdenTrabajoParte
 */
export const updateOrdenTrabajoParte = async (id, data) => {
    const { estado, comentario } = data;
    const fechaActualizacion = getUTCTime(new Date().toISOString());

    try {
        return await prisma.ordenTrabajoParte.update({
            where: { id_orden_trabajo_parte: parseInt(id) },
            data: {
                ...(estado !== undefined && { estado }),
                ...(comentario !== undefined && { comentario }),
                actualizado_en: fechaActualizacion,
            }
        });
    } catch (error) {
        if (error.code === 'P2025') { 
            throw new Error(`La orden de trabajo parte con ID ${id} no existe o está inactiva.`);
        } else {
            throw error;
        }
    }
};

/**
 * Desactivar una OrdenTrabajoParte
 */
export const deleteOrdenTrabajoParte = async (id) => {
    const orden = await prisma.ordenTrabajoParte.findUnique({
        where: { id_orden_trabajo_parte: parseInt(id) }
    });

    if (!orden || orden.estado === "inactivo") {
        throw new Error(`La orden con ID ${id} no existe o ya está inactiva.`);
    }

    return await prisma.ordenTrabajoParte.update({
        where: { id_orden_trabajo_parte: parseInt(id) },
        data: { estado: "inactivo" },
    });
};
