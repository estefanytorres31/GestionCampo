import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear una Asistencia (Entrada o Salida)
 * @param {Object} params
 * @param {number} params.id_usuario
 * @param {number} params.id_embarcacion
 * @param {TipoAsistencia} params.tipo - 'entrada' o 'salida'
 * @param {Decimal} [params.latitud]
 * @param {Decimal} [params.longitud]
 * @param {number} [params.id_orden_trabajo]
 * @param {number} [params.id_puerto]
 * @returns {Promise<Object>} Asistencia creada
 */
export const crearAsistencia = async ({
    id_usuario,
    id_embarcacion,
    tipo,
    latitud,
    longitud,
    id_orden_trabajo,
    id_puerto,
}) => {
    const fechaActual = getUTCTime(new Date().toISOString());

    // Validaciones básicas
    if (isNaN(id_usuario) || isNaN(id_embarcacion)) {
        throw new Error("Los IDs de usuario y embarcación deben ser válidos.");
    }

    if (!["entrada", "salida"].includes(tipo)) {
        throw new Error("El tipo de asistencia debe ser 'entrada' o 'salida'.");
    }

    // Verificar que el Usuario exista y esté activo
    const usuario = await prisma.usuario.findUnique({
        where: { id: id_usuario },
    });

    if (!usuario || !usuario.estado) {
        throw new Error(`El usuario con ID ${id_usuario} no existe o está inactivo.`);
    }

    // Verificar que la Embarcación exista y esté activa
    const embarcacion = await prisma.embarcacion.findUnique({
        where: { id_embarcacion: id_embarcacion },
    });

    if (!embarcacion || !embarcacion.estado) {
        throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
    }

    // Opcional: Verificar que la Orden de Trabajo exista si se proporciona
    if (id_orden_trabajo) {
        const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
            where: { id_orden_trabajo: id_orden_trabajo },
        });

        if (!ordenTrabajo) {
            throw new Error(`La orden de trabajo con ID ${id_orden_trabajo} no existe.`);
        }
    }

    // Opcional: Verificar que el Puerto exista si se proporciona
    if (id_puerto) {
        const puerto = await prisma.puerto.findUnique({
            where: { id_puerto: id_puerto },
        });

        if (!puerto || !puerto.estado) {
            throw new Error(`El puerto con ID ${id_puerto} no existe o está inactivo.`);
        }
    }

    // 🔹 **Nueva Validación: Asegurar la Consistencia entre Entrada y Salida**
    if (tipo === "salida") {
        // Obtener la última asistencia del usuario para la embarcación
        const ultimaAsistencia = await prisma.asistencia.findFirst({
            where: {
                id_usuario: id_usuario,
                id_embarcacion: id_embarcacion,
            },
            orderBy: { fecha_hora: "desc" },
        });

        if (!ultimaAsistencia) {
            throw new Error("No se puede registrar una salida sin una entrada previa.");
        }

        if (ultimaAsistencia.tipo !== "entrada") {
            throw new Error("La última asistencia registrada no es una entrada. No se puede registrar una salida.");
        }

        // Opcional: Verificar si ya existe una salida después de la última entrada
        const asistenciaConSalida = await prisma.asistencia.findFirst({
            where: {
                id_usuario: id_usuario,
                id_embarcacion: id_embarcacion,
                tipo: "salida",
                fecha_hora: {
                    gt: ultimaAsistencia.fecha_hora,
                },
            },
            orderBy: { fecha_hora: "desc" },
        });

        if (asistenciaConSalida) {
            throw new Error("Ya existe una salida registrada después de la última entrada.");
        }
    }

    // Crear la Asistencia
    const asistencia = await prisma.asistencia.create({
        data: {
            id_usuario,
            id_embarcacion,
            tipo,
            latitud,
            longitud,
            id_orden_trabajo,
            id_puerto,
            fecha_hora: fechaActual,
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });

    return asistencia;
};

/**
 * Obtener Asistencias por Usuario
 * @param {number} id_usuario
 * @returns {Promise<Array>} Lista de asistencias
 */
export const obtenerAsistenciasPorUsuario = async (id_usuario) => {
    if (isNaN(id_usuario)) {
        throw { status: 400, message: "El ID de usuario debe ser válido." };
    }

    const asistencias = await prisma.asistencia.findMany({
        where: { id_usuario },
        include: {
            embarcacion: true,
            orden_trabajo: true,
            puerto: true,
            usuario: true,
        },
        orderBy: { fecha_hora: "desc" },
    });

    return asistencias;
};

/**
 * Obtener Asistencias por Embarcación
 * @param {number} id_embarcacion
 * @returns {Promise<Array>} Lista de asistencias
 */
export const obtenerAsistenciasPorEmbarcacion = async (id_embarcacion) => {
    if (isNaN(id_embarcacion)) {
        throw { status: 400, message: "El ID de embarcación debe ser válido." };
    }

    const asistencias = await prisma.asistencia.findMany({
        where: { id_embarcacion },
        include: {
            embarcacion: true,
            orden_trabajo: true,
            puerto: true,
            usuario: true,
        },
        orderBy: { fecha_hora: "desc" },
    });

    return asistencias;
};

/**
 * Actualizar una Asistencia
 * @param {number} id_asistencia
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Asistencia actualizada
 */
export const actualizarAsistencia = async (id_asistencia, data) => {
    const fechaActual = getUTCTime(new Date().toISOString());

    if (isNaN(id_asistencia)) {
        throw new Error("El ID de asistencia debe ser válido.");
    }

    // Verificar que la Asistencia exista
    const asistenciaExistente = await prisma.asistencia.findUnique({
        where: { id_asistencia },
    });

    if (!asistenciaExistente) {
        throw new Error(`La asistencia con ID ${id_asistencia} no existe.`);
    }

    // Actualizar la Asistencia
    const asistenciaActualizada = await prisma.asistencia.update({
        where: { id_asistencia },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
    });

    return asistenciaActualizada;
};

/**
 * Eliminar una Asistencia
 * @param {number} id_asistencia
 * @returns {Promise<Object>} Asistencia eliminada
 */
export const eliminarAsistencia = async (id_asistencia) => {
    if (isNaN(id_asistencia)) {
        throw new Error("El ID de asistencia debe ser válido.");
    }

    // Verificar que la Asistencia exista
    const asistenciaExistente = await prisma.asistencia.findUnique({
        where: { id_asistencia },
    });

    if (!asistenciaExistente) {
        throw new Error(`La asistencia con ID ${id_asistencia} no existe.`);
    }

    // Eliminar la Asistencia
    const asistenciaEliminada = await prisma.asistencia.delete({
        where: { id_asistencia },
    });

    return asistenciaEliminada;
};
