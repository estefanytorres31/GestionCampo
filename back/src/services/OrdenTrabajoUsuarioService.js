import { PrismaClient } from "@prisma/client";
// import { sendNotification } from "../utils/Notification.js"; // Implementa esta función según tus necesidades
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Asignar un Usuario a una Orden de Trabajo
 * @param {Object} params
 * @param {number} params.id_orden_trabajo
 * @param {number} params.id_usuario
 * @param {string} [params.rol_en_orden]
 * @param {string} [params.observaciones]
 * @returns {Promise<Object>} Asignación creada o actualizada
 */
export const assignUserToOrdenTrabajo = async ({ id_orden_trabajo, id_usuario, rol_en_orden, observaciones }) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (isNaN(id_orden_trabajo) || isNaN(id_usuario)) {
        throw new Error("Los IDs de la orden de trabajo y del usuario deben ser válidos.");
    }

    // Verificar que la Orden de Trabajo exista
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo },
    });

    if (!ordenTrabajo) {
        throw new Error(`La orden de trabajo con ID ${id_orden_trabajo} no existe.`);
    }

    // Verificar que el Usuario exista y esté activo
    const usuario = await prisma.usuario.findUnique({
        where: { id: id_usuario },
    });

    if (!usuario || !usuario.estado) {
        throw new Error(`El usuario con ID ${id_usuario} no existe o está inactivo.`);
    }

    // Verificar si la asignación ya existe
    const asignacionExistente = await prisma.ordenTrabajoUsuario.findUnique({
        where: {
            orden_trabajo_usuario_unique: {
                id_orden_trabajo,
                id_usuario,
            },
        },
    });

    if (asignacionExistente) {
        // Actualizar la asignación existente
        const asignacionActualizada = await prisma.ordenTrabajoUsuario.update({
            where: { id_orden_trabajo_usuario: asignacionExistente.id_orden_trabajo_usuario },
            data: {
                rol_en_orden: rol_en_orden || asignacionExistente.rol_en_orden,
                observaciones: observaciones || asignacionExistente.observaciones,
                actualizado_en:fecha_creacion
            },
        });

        // Enviar notificación al usuario
        // await sendNotification(id_usuario, `Tu asignación a la orden de trabajo ID ${id_orden_trabajo} ha sido actualizada.`);

        return asignacionActualizada;
    }

    // Crear una nueva asignación
    const nuevaAsignacion = await prisma.ordenTrabajoUsuario.create({
        data: {
            id_orden_trabajo,
            id_usuario,
            rol_en_orden,
            observaciones,
            creado_en:fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    // Enviar notificación al usuario
    // await sendNotification(id_usuario, `Has sido asignado a la orden de trabajo ID ${id_orden_trabajo} como ${rol_en_orden}.`);

    return nuevaAsignacion;
};

/**
 * Obtener todos los Usuarios asignados a una Orden de Trabajo
 * @param {number} id_orden_trabajo
 * @returns {Promise<Array>} Lista de asignaciones
 */
export const getUsuariosByOrdenTrabajo = async (id_orden_trabajo) => {
    // Convertir a entero
    const idOrdenTrabajo = parseInt(id_orden_trabajo, 10);

    if (isNaN(idOrdenTrabajo)) {
        throw { status: 400, message: "El ID de la orden de trabajo debe ser un número válido." };
    }

    // Verificar que la Orden de Trabajo exista
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo: idOrdenTrabajo },
    });

    if (!ordenTrabajo) {
        throw { status: 404, message: `La orden de trabajo con ID ${idOrdenTrabajo} no existe.` };
    }

    // Obtener Usuarios Asignados
    const usuariosAsignados = await prisma.ordenTrabajoUsuario.findMany({
        where: { id_orden_trabajo: idOrdenTrabajo },
        include: {
            usuario: true,
        },
    });

    if (usuariosAsignados.length === 0) {
        return []; // Retornar una lista vacía si no hay asignaciones
    }

    return usuariosAsignados;
};

/**
 * Obtener una Asignación por su ID
 * @param {number} id_orden_trabajo_usuario
 * @returns {Promise<Object>} Asignación encontrada
 */
export const getAsignacionById = async (id_orden_trabajo_usuario) => {
    if (isNaN(id_orden_trabajo_usuario)) {
        throw new Error("El ID de la asignación debe ser válido.");
    }

    const asignacion = await prisma.ordenTrabajoUsuario.findUnique({
        where: { id_orden_trabajo_usuario },
        include: {
            usuario: true,
            orden_trabajo: true,
        },
    });

    if (!asignacion) {
        throw new Error(`La asignación con ID ${id_orden_trabajo_usuario} no existe.`);
    }

    return asignacion;
};

/**
 * Actualizar una Asignación
 * @param {number} id_orden_trabajo_usuario
 * @param {Object} data
 * @param {string} [data.rol_en_orden]
 * @param {string} [data.observaciones]
 * @returns {Promise<Object>} Asignación actualizada
 */
export const updateAsignacion = async (id_orden_trabajo_usuario, { rol_en_orden, observaciones }) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (isNaN(id_orden_trabajo_usuario)) {
        throw new Error("El ID de la asignación debe ser válido.");
    }

    // Verificar que la asignación exista
    const asignacionExistente = await prisma.ordenTrabajoUsuario.findUnique({
        where: { id_orden_trabajo_usuario },
    });

    if (!asignacionExistente) {
        throw new Error(`La asignación con ID ${id_orden_trabajo_usuario} no existe.`);
    }

    // Actualizar la asignación
    const asignacionActualizada = await prisma.ordenTrabajoUsuario.update({
        where: { id_orden_trabajo_usuario },
        data: {
            rol_en_orden: rol_en_orden || asignacionExistente.rol_en_orden,
            observaciones: observaciones || asignacionExistente.observaciones,
            actualizado_en: fecha_creacion
        },
    });

    // Enviar notificación al usuario
    // await sendNotification(asignacionActualizada.id_usuario, `Tu asignación en la orden de trabajo ID ${asignacionActualizada.id_orden_trabajo} ha sido actualizada.`);

    return asignacionActualizada;
};

/**
 * Eliminar una Asignación
 * @param {number} id_orden_trabajo_usuario
 * @returns {Promise<Object>} Asignación eliminada
 */
export const removeAsignacion = async (id_orden_trabajo_usuario) => {
    if (isNaN(id_orden_trabajo_usuario)) {
        throw new Error("El ID de la asignación debe ser válido.");
    }

    // Verificar que la asignación exista
    const asignacionExistente = await prisma.ordenTrabajoUsuario.findUnique({
        where: { id_orden_trabajo_usuario },
    });

    if (!asignacionExistente) {
        throw new Error(`La asignación con ID ${id_orden_trabajo_usuario} no existe.`);
    }

    // Eliminar la asignación
    const asignacionEliminada = await prisma.ordenTrabajoUsuario.delete({
        where: { id_orden_trabajo_usuario },
    });

    // Enviar notificación al usuario
    // await sendNotification(asignacionEliminada.id_usuario, `Tu asignación en la orden de trabajo ID ${asignacionEliminada.id_orden_trabajo} ha sido eliminada.`);

    return asignacionEliminada;
};

/**
 * Reasignar una Orden de Trabajo a Otros Usuarios
 * @param {number} id_orden_trabajo
 * @param {Array<Object>} nuevos_usuarios
 * @returns {Promise<Object>} Resultados de la transacción
 */
export const reasignarOrdenTrabajo = async (id_orden_trabajo, nuevos_usuarios) => {
    /*
        'nuevos_usuarios' es un array de objetos que contienen:
        - id_usuario
        - rol_en_orden
        - observaciones
    */

    if (isNaN(id_orden_trabajo)) {
        throw new Error("El ID de la orden de trabajo debe ser válido.");
    }

    if (!Array.isArray(nuevos_usuarios) || nuevos_usuarios.length === 0) {
        throw new Error("Debe proporcionar una lista válida de nuevos usuarios.");
    }

    // Iniciar una transacción
    const resultados = await prisma.$transaction(async (tx) => {
        // Eliminar todas las asignaciones actuales
        const asignacionesActuales = await tx.ordenTrabajoUsuario.findMany({
            where: { id_orden_trabajo },
        });

        // Eliminar asignaciones existentes
        const eliminarAsignaciones = asignacionesActuales.map(asignacion =>
            tx.ordenTrabajoUsuario.delete({
                where: { id_orden_trabajo_usuario: asignacion.id_orden_trabajo_usuario },
            })
        );

        await Promise.all(eliminarAsignaciones);

        // Asignar los nuevos usuarios
        const asignaciones = nuevos_usuarios.map((usuario) => ({
            id_orden_trabajo,
            id_usuario: usuario.id_usuario,
            rol_en_orden: usuario.rol_en_orden,
            observaciones: usuario.observaciones,
        }));

        const nuevasAsignaciones = await tx.ordenTrabajoUsuario.createMany({
            data: asignaciones,
            skipDuplicates: true,
        });

        // Enviar notificaciones a los nuevos usuarios
        for (const usuario of nuevos_usuarios) {
            // await sendNotification(usuario.id_usuario, `Has sido asignado a la orden de trabajo ID ${id_orden_trabajo} como ${usuario.rol_en_orden}.`);
        }

        return nuevasAsignaciones;
    });

    return resultados;
};

/**
 * Generar Reportes de Órdenes de Trabajo
 * @param {Object} filtros
 * @returns {Promise<Array>} Lista de órdenes de trabajo
 */
export const generarReporteOrdenesTrabajo = async (filtros) => {
    /*
        'filtros' puede contener:
        - fecha_inicio
        - fecha_fin
        - estado
        - id_usuario
        - id_embarcacion
        etc.
    */

    const where = {};

    if (filtros.fecha_inicio && filtros.fecha_fin) {
        where.fecha_asignacion = {
            gte: new Date(filtros.fecha_inicio),
            lte: new Date(filtros.fecha_fin),
        };
    }

    if (filtros.estado) {
        where.estado = filtros.estado;
    }

    if (filtros.id_usuario) {
        where.orden_trabajo_usuario = {
            some: {
                id_usuario: parseInt(filtros.id_usuario, 10),
            },
        };
    }

    if (filtros.id_embarcacion) {
        where.id_embarcacion = parseInt(filtros.id_embarcacion, 10);
    }

    // Agregar otros filtros según sea necesario

    const reportes = await prisma.ordenTrabajo.findMany({
        where,
        include: {
            tipo_trabajo: true,
            embarcacion: true,
            puerto: true,
            jefe_asigna: true,
            orden_trabajo_usuario: {
                include: {
                    usuario: true,
                },
            },
            orden_trabajo_sistemas: {
                include: {
                    sistema: true,
                    embarcacion_sistema: {
                        include: {
                            embarcacion: true,
                            sistema: true,
                        },
                    },
                },
            },
        },
    });

    return reportes;
};