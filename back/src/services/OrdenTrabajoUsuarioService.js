import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoUsuario (Responsable o Ayudante)
 */
export const createOrdenTrabajoUsuario = async (data) => {
    const { id_orden_trabajo, id_usuario, rol_en_orden, observaciones } = data;

    if (!id_orden_trabajo || !id_usuario || !rol_en_orden) {
        throw new Error("Los campos id_orden_trabajo, id_usuario y rol_en_orden son obligatorios.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la Orden de Trabajo existe
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo }
    });

    if (!ordenTrabajo) {
        throw new Error(`No se encontró la Orden de Trabajo con ID ${id_orden_trabajo}.`);
    }

    // Verificar si el Usuario existe
    const usuario = await prisma.usuario.findUnique({
        where: { id: id_usuario }
    });

    if (!usuario) {
        throw new Error(`No se encontró el Usuario con ID ${id_usuario}.`);
    }

    // Verificar si ya existe un Responsable en esta orden
    if (rol_en_orden === "Responsable") {
        const responsableExistente = await prisma.ordenTrabajoUsuario.findFirst({
            where: {
                id_orden_trabajo,
                rol_en_orden: "Responsable",
                estado: true
            }
        });

        if (responsableExistente) {
            throw new Error("Ya existe un responsable asignado para esta Orden de Trabajo.");
        }
    }

    // Verificar si el usuario ya tiene una asignación en esta orden (incluso si está inactivo)
    const existente = await prisma.ordenTrabajoUsuario.findFirst({
        where: { id_orden_trabajo, id_usuario }
    });

    if (existente) {
        if (existente.estado) {
            throw new Error("Este usuario ya está asignado a la orden de trabajo.");
        } else {
            // Reactivar si estaba inactivo
            return await prisma.ordenTrabajoUsuario.update({
                where: { id_orden_trabajo_usuario: existente.id_orden_trabajo_usuario },
                data: {
                    estado: true,
                    rol_en_orden,
                    observaciones,
                    actualizado_en: fechaActual
                }
            });
        }
    }

    // Crear nueva asignación
    return await prisma.ordenTrabajoUsuario.create({
        data: {
            id_orden_trabajo,
            id_usuario,
            rol_en_orden,
            observaciones,
            estado: true,
            creado_en: fechaActual,
            actualizado_en: fechaActual
        }
    });
};

/**
 * Actualizar una asignación de usuario en una orden de trabajo
 */
export const updateOrdenTrabajoUsuario = async (id, data) => {
    const { id_usuario, rol_en_orden, observaciones } = data;

    if (!id) {
        throw new Error("El ID de la asignación es obligatorio.");
    }

    // Buscar la asignación existente
    const asignacion = await prisma.ordenTrabajoUsuario.findUnique({
        where: { id_orden_trabajo_usuario: parseInt(id) }
    });

    if (!asignacion || !asignacion.estado) {
        throw new Error(`La asignación con ID ${id} no existe o está inactiva.`);
    }

    // Si se intenta actualizar a Responsable, verificar si ya hay uno asignado
    if (rol_en_orden === "Responsable") {
        const responsableExistente = await prisma.ordenTrabajoUsuario.findFirst({
            where: {
                id_orden_trabajo: asignacion.id_orden_trabajo,
                rol_en_orden: "Responsable",
                estado: true,
                id_orden_trabajo_usuario: { not: asignacion.id_orden_trabajo_usuario }
            }
        });

        if (responsableExistente) {
            throw new Error("Ya existe un responsable asignado para esta Orden de Trabajo.");
        }
    }

    const fechaActualizacion = getUTCTime(new Date().toISOString());

    // Actualizar la asignación
    return await prisma.ordenTrabajoUsuario.update({
        where: { id_orden_trabajo_usuario: parseInt(id) },
        data: {
            id_usuario,
            rol_en_orden,
            observaciones,
            actualizado_en: fechaActualizacion
        }
    });
};

/**
 * Obtener todas las asignaciones activas con filtros opcionales
 */
export const getAllOrdenTrabajoUsuarios = async (filters) => {
    const { rol_en_orden, id_orden_trabajo, id_usuario } = filters;

    const whereClause = {
        estado: true, // Solo asignaciones activas
        ...(rol_en_orden && { rol_en_orden }), 
        ...(id_orden_trabajo && { id_orden_trabajo: parseInt(id_orden_trabajo) }),
        ...(id_usuario && { id_usuario: parseInt(id_usuario) })
    };

    const asignaciones = await prisma.ordenTrabajoUsuario.findMany({
        where: whereClause,
        orderBy: { creado_en: "desc" }
    });

    if (asignaciones.length === 0) {
        throw new Error("No se encontraron asignaciones con los filtros aplicados.");
    }

    return asignaciones;
};


/**
 * Obtener una asignación por ID
 */
export const getOrdenTrabajoUsuarioById = async (id) => {
    const asignacion = await prisma.ordenTrabajoUsuario.findUnique({
        where: { id_orden_trabajo_usuario: parseInt(id) }
    });

    if (!asignacion || !asignacion.estado) {
        throw new Error(`La asignación con ID ${id} no existe o está inactiva.`);
    }

    return asignacion;
};

/**
 * Desactivar una asignación (sin eliminarla)
 */
export const deleteOrdenTrabajoUsuario = async (id) => {
    const asignacion = await prisma.ordenTrabajoUsuario.findUnique({
        where: { id_orden_trabajo_usuario: parseInt(id) }
    });

    if (!asignacion || !asignacion.estado) {
        throw new Error(`La asignación con ID ${id} no existe o ya está inactiva.`);
    }

    return await prisma.ordenTrabajoUsuario.update({
        where: { id_orden_trabajo_usuario: parseInt(id) },
        data: { estado: false }
    });
};

/**
 * Reasignar una orden de trabajo a otro usuario
 */
export const reasignarOrdenTrabajo = async (id_orden_trabajo, nuevos_usuarios) => {
    if (!id_orden_trabajo || !nuevos_usuarios || !Array.isArray(nuevos_usuarios)) {
        throw new Error("El id_orden_trabajo y la lista de nuevos_usuarios son obligatorios.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la Orden de Trabajo existe y si su estado permite la reasignación
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo }
    });

    if (!ordenTrabajo) {
        throw new Error(`No se encontró la Orden de Trabajo con ID ${id_orden_trabajo}.`);
    }

    if (!["en_progreso", "pendiente"].includes(ordenTrabajo.estado)) {
        throw new Error(`La Orden de Trabajo no puede ser reasignada porque su estado es ${ordenTrabajo.estado}.`);
    }

    // Verificar si todos los nuevos usuarios pueden ser asignados
    for (const usuario of nuevos_usuarios) {
        const { id_usuario, rol_en_orden } = usuario;

        if (!id_usuario || !rol_en_orden) {
            throw new Error("Cada nuevo usuario debe tener id_usuario y rol_en_orden.");
        }
    }

    // Desactivar todas las asignaciones previas de esta orden que no se van a reutilizar
    await prisma.ordenTrabajoUsuario.updateMany({
        where: {
            id_orden_trabajo,
            estado: true,
            id_usuario: { notIn: nuevos_usuarios.map(usuario => usuario.id_usuario) }
        },
        data: { estado: false, actualizado_en: fechaActual }
    });

    // Crear nuevas asignaciones o reactivar asignaciones existentes con nuevos roles
    const nuevasAsignaciones = nuevos_usuarios.map(async (usuario) => {
        const { id_usuario, rol_en_orden, observaciones } = usuario;

        // Buscar asignación existente, incluso si está inactiva
        const asignacionExistente = await prisma.ordenTrabajoUsuario.findFirst({
            where: { id_orden_trabajo, id_usuario }
        });

        if (asignacionExistente) {
            // Reactivar y actualizar rol y observaciones si la asignación existe
            return await prisma.ordenTrabajoUsuario.update({
                where: { id_orden_trabajo_usuario: asignacionExistente.id_orden_trabajo_usuario },
                data: {
                    estado: true,
                    rol_en_orden,
                    observaciones: observaciones || "",
                    actualizado_en: fechaActual
                }
            });
        }

        // Crear nueva asignación si no existe
        return await prisma.ordenTrabajoUsuario.create({
            data: {
                id_orden_trabajo,
                id_usuario,
                rol_en_orden,
                observaciones: observaciones || "",
                estado: true,
                creado_en: fechaActual,
                actualizado_en: fechaActual
            }
        });
    });

    return await Promise.all(nuevasAsignaciones);
};