import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Obtener la lista de partes de un sistema en una embarcación según el tipo de trabajo
 * @param {number} id_tipo_trabajo - ID del tipo de trabajo
 * @param {number} id_embarcacion - ID de la embarcación
 * @returns {Promise<Array>} - Lista de partes
 */
export const getPartesByTipoTrabajoEmbarcacion = async (id_tipo_trabajo, id_embarcacion) => {
    return await prisma.tipoTrabajoEmbarcacionSistemaParte.findMany({
        where: {
            id_tipo_trabajo: parseInt(id_tipo_trabajo, 10),
            embarcacion_sistema_parte: {
                embarcacion_sistema: {
                    id_embarcacion: parseInt(id_embarcacion, 10),
                },
            },
        },
        include: {
            embarcacion_sistema_parte: {
                include: {
                    embarcacion_sistema: true,
                    parte: true,
                },
            },
            tipo_trabajo: true,
        },
    });
};