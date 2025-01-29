import { getPeruTime, getUTCTime } from "../utils/Time.js";
import { PrismaClient } from "@prisma/client";
// import { sendNotification } from "../utils/Notification.js"; // Implementa esta función según tus necesidades

const prisma = new PrismaClient();

/**
 * Asignar un Sistema a una Orden de Trabajo
 * @param {Object} params
 * @param {number} params.id_orden_trabajo
 * @param {number} params.id_sistema
 * @param {number} params.id_embarcacion_sistema
 * @param {string} [params.observaciones]
 * @returns {Promise<Object>} Asignación creada o actualizada
 */
export const assignSistemaToOrdenTrabajo = async ({ id_orden_trabajo, id_sistema, id_embarcacion_sistema, observaciones }) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (isNaN(id_orden_trabajo) || isNaN(id_sistema) || isNaN(id_embarcacion_sistema)) {
        throw new Error("Los IDs de la orden de trabajo, sistema y embarcación_sistema deben ser válidos.");
    }

    // Verificar que la Orden de Trabajo exista
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo },
    });

    if (!ordenTrabajo) {
        throw new Error(`La orden de trabajo con ID ${id_orden_trabajo} no existe.`);
    }

    // Verificar que el Sistema exista y esté activo
    const sistema = await prisma.sistema.findUnique({
        where: { id_sistema },
    });

    if (!sistema || !sistema.estado) {
        throw new Error(`El sistema con ID ${id_sistema} no existe o está inactivo.`);
    }

    // Verificar que la EmbarcacionSistema exista y esté activa
    const embarcacionSistema = await prisma.embarcacionSistema.findUnique({
        where: { id_embarcacion_sistema },
    });

    if (!embarcacionSistema || !embarcacionSistema.estado_sistema) {
        throw new Error(`La embarcación_sistema con ID ${id_embarcacion_sistema} no existe o está inactiva.`);
    }

    // Verificar si la asignación ya existe
    const asignacionExistente = await prisma.ordenTrabajoSistema.findUnique({
        where: {
            orden_trabajo_sistema_unique: {
                id_orden_trabajo,
                id_sistema,
            },
        },
    });

    if (asignacionExistente) {
        // Actualizar la asignación existente
        const asignacionActualizada = await prisma.ordenTrabajoSistema.update({
            where: { id_orden_trabajo_sistema: asignacionExistente.id_orden_trabajo_sistema },
            data: {
                estado: "pendiente", // Resetear estado o mantener el existente
                observaciones: observaciones || asignacionExistente.observaciones,
                actualizado_en: fecha_creacion
            },
        });

        // Enviar notificación al encargado
        // await sendNotification(embarcacionSistema.id_usuario, `Tu sistema ${sistema.nombre_sistema} ha sido asignado a la orden de trabajo ID ${id_orden_trabajo}.`);

        return asignacionActualizada;
    }

    // Crear una nueva asignación
    const nuevaAsignacion = await prisma.ordenTrabajoSistema.create({
        data: {
            id_orden_trabajo,
            id_sistema,
            id_embarcacion_sistema,
            estado: "pendiente",
            observaciones,
            creado_en:fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    // Enviar notificación al encargado
    // await sendNotification(embarcacionSistema.id_usuario, `Tu sistema ${sistema.nombre_sistema} ha sido asignado a la orden de trabajo ID ${id_orden_trabajo}.`);

    return nuevaAsignacion;
};

/**
 * Modificar la Asignación de Sistemas a una Orden de Trabajo
 * @param {number} id_orden_trabajo_sistema
 * @param {Object} data
 * @param {string} [data.estado]
 * @param {string} [data.observaciones]
 * @returns {Promise<Object>} Asignación modificada
 */
export const modificarAsignacionSistema = async (id_orden_trabajo_sistema, { estado, observaciones }) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (isNaN(id_orden_trabajo_sistema)) {
        throw new Error("El ID de la asignación debe ser válido.");
    }

    // Verificar que la asignación exista
    const asignacionExistente = await prisma.ordenTrabajoSistema.findUnique({
        where: { id_orden_trabajo_sistema },
    });

    if (!asignacionExistente) {
        throw new Error(`La asignación con ID ${id_orden_trabajo_sistema} no existe.`);
    }

    // Validar el estado si se proporciona
    const estadosValidos = ["pendiente", "en_progreso", "completado", "cancelado"];
    if (estado && !estadosValidos.includes(estado)) {
        throw new Error(`El estado "${estado}" no es válido. Estados permitidos: ${estadosValidos.join(", ")}.`);
    }

    // Actualizar la asignación
    const asignacionActualizada = await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema },
        data: {
            estado: estado || asignacionExistente.estado,
            observaciones: observaciones || asignacionExistente.observaciones,
            actualizado_en: fecha_creacion
        },
    });

    // Enviar notificación al encargado
    // await sendNotification(asignacionExistente.embarcacion_sistema.id_usuario, `Tu sistema ${asignacionExistente.sistema.nombre_sistema} en la orden de trabajo ID ${asignacionExistente.id_orden_trabajo} ha sido actualizado a estado "${asignacionActualizada.estado}".`);

    return asignacionActualizada;
};

/**
 * Desactivar un Sistema de una Orden de Trabajo
 * @param {number} id_orden_trabajo_sistema
 * @returns {Promise<Object>} Asignación desactivada
 */
export const deactivateSistemaFromOrdenTrabajo = async (id_orden_trabajo_sistema) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (isNaN(id_orden_trabajo_sistema)) {
        throw new Error("El ID de la asignación debe ser válido.");
    }

    // Verificar que la asignación exista y esté en un estado que se pueda desactivar
    const asignacion = await prisma.ordenTrabajoSistema.findUnique({
        where: { id_orden_trabajo_sistema },
        include: {
            sistema: true,
            embarcacion_sistema: true,
        },
    });

    if (!asignacion || asignacion.estado === "completado" || asignacion.estado === "cancelado") {
        throw new Error("La asignación no existe o ya está desactivada/completada.");
    }

    // Desactivar la asignación
    const asignacionDesactivada = await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema },
        data: { estado: "cancelado", actualizado_en: fecha_creacion },
    });

    // Enviar notificación al encargado
    // await sendNotification(asignacion.embarcacion_sistema.id_usuario, `Tu sistema ${asignacion.sistema.nombre_sistema} en la orden de trabajo ID ${asignacion.id_orden_trabajo} ha sido desactivado.`);

    return asignacionDesactivada;
};

/**
 * Obtener todos los Sistemas asignados a una Orden de Trabajo
 * @param {number} id_orden_trabajo
 * @returns {Promise<Array>} Lista de asignaciones
 */
export const getOrdenTrabajoById = async (id) => {
    // Convertir el ID a un entero
    const idOrdenTrabajo = parseInt(id, 10);

    // Validar si el ID es un número válido
    if (isNaN(idOrdenTrabajo)) {
        throw { status: 400, message: "El ID de la orden de trabajo debe ser un número válido." };
    }

    // Buscar la orden de trabajo
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo: idOrdenTrabajo },
    });

    // Verificar si existe la orden de trabajo
    if (!ordenTrabajo) {
        throw { status: 404, message: `La orden de trabajo con ID ${idOrdenTrabajo} no existe.` };
    }

    return ordenTrabajo;
};

/**
 * Generar Reportes de Ordenes de Trabajo con Sistemas
 * @param {Object} filtros
 * @returns {Promise<Array>} Lista de órdenes de trabajo
 */
export const generarReporteOrdenesTrabajoConSistemas = async (filtros) => {
    /*
        'filtros' puede contener:
        - fecha_inicio
        - fecha_fin
        - estado
        - id_sistema
        - id_embarcacion_sistema
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

    if (filtros.id_sistema) {
        where.orden_trabajo_sistemas = {
            some: {
                id_sistema: parseInt(filtros.id_sistema, 10),
            },
        };
    }

    if (filtros.id_embarcacion_sistema) {
        where.orden_trabajo_sistemas = {
            some: {
                id_embarcacion_sistema: parseInt(filtros.id_embarcacion_sistema, 10),
            },
        };
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

/**
 * Finalizar una Orden de Trabajo y Actualizar Estados
 * @param {number} id_orden_trabajo
 * @returns {Promise<Object>} Orden de Trabajo finalizada
 */
export const finalizarOrdenTrabajo = async (id_orden_trabajo) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (isNaN(id_orden_trabajo)) {
        throw new Error("El ID de la orden de trabajo debe ser válido.");
    }

    // Iniciar una transacción
    const ordenTrabajoFinalizada = await prisma.$transaction(async (tx) => {
        // Verificar que la Orden de Trabajo exista
        const ordenTrabajo = await tx.ordenTrabajo.findUnique({
            where: { id_orden_trabajo },
        });

        if (!ordenTrabajo) {
            throw new Error(`La orden de trabajo con ID ${id_orden_trabajo} no existe.`);
        }

        // Actualizar el estado de la Orden de Trabajo a 'completado'
        const updatedOrdenTrabajo = await tx.ordenTrabajo.update({
            where: { id_orden_trabajo },
            data: { estado: "completado", actualizado_en: new Date() },
        });

        // Actualizar el estado de todas las OrdenTrabajoSistema relacionadas a 'completado'
        const sistemasAsignados = await tx.ordenTrabajoSistema.findMany({
            where: { id_orden_trabajo },
            include: { sistema: true, embarcacion_sistema: true },
        });

        const actualizarSistemas = sistemasAsignados.map(asignacion =>
            tx.ordenTrabajoSistema.update({
                where: { id_orden_trabajo_sistema: asignacion.id_orden_trabajo_sistema },
                data: { estado: "completado", actualizado_en: fecha_creacion},
            })
        );

        await Promise.all(actualizarSistemas);

        // Actualizar observaciones en OrdenTrabajoUsuario si aplica
        const usuariosAsignados = await tx.ordenTrabajoUsuario.findMany({
            where: { id_orden_trabajo },
            include: { usuario: true },
        });

        const actualizarUsuarios = usuariosAsignados.map(asignacion =>
            tx.ordenTrabajoUsuario.update({
                where: { id_orden_trabajo_usuario: asignacion.id_orden_trabajo_usuario },
                data: { observaciones: "Orden de trabajo completada.", actualizado_en: fecha_creacion },
            })
        );

        await Promise.all(actualizarUsuarios);

        // Enviar notificaciones a los usuarios y encargados de sistemas
        // for (const usuarioAsignado of usuariosAsignados) {
        //     await sendNotification(usuarioAsignado.id_usuario, `La orden de trabajo ID ${id_orden_trabajo} ha sido completada.`);
        // }

        // for (const asignacion of sistemasAsignados) {
        //     await sendNotification(asignacion.embarcacion_sistema.id_usuario, `El sistema ${asignacion.sistema.nombre_sistema} ha sido completado en la orden de trabajo ID ${id_orden_trabajo}.`);
        // }

        return updatedOrdenTrabajo;
    });

    return ordenTrabajoFinalizada;
};