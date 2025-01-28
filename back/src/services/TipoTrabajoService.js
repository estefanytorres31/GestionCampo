import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear o reactivar un TipoTrabajo
export const createTipoTrabajo = async (nombre_trabajo, descripcion) => {
    if (!nombre_trabajo) {
        throw new Error("El nombre del tipo de trabajo es obligatorio.");
    }

    // Verificar si el TipoTrabajo ya existe
    const tipoTrabajoExistente = await prisma.tipoTrabajo.findUnique({
        where: { nombre_trabajo },
    });

    if (tipoTrabajoExistente) {
        if (tipoTrabajoExistente.estado) {
            throw new Error(`El tipo de trabajo "${nombre_trabajo}" ya existe y está activo.`);
        } else {
            // Reactivar el TipoTrabajo existente
            const tipoTrabajoReactivado = await prisma.tipoTrabajo.update({
                where: { id_tipo_trabajo: tipoTrabajoExistente.id_tipo_trabajo },
                data: {
                    estado: true,
                    descripcion: descripcion || tipoTrabajoExistente.descripcion,
                    actualizado_en: new Date(),
                },
            });
            return tipoTrabajoReactivado;
        }
    }

    // Crear un nuevo TipoTrabajo si no existe
    const nuevoTipoTrabajo = await prisma.tipoTrabajo.create({
        data: {
            nombre_trabajo,
            descripcion,
        },
    });

    return nuevoTipoTrabajo;
};

// Obtener todos los TipoTrabajo activos
export const getAllTipoTrabajos = async () => {
    const tipoTrabajos = await prisma.tipoTrabajo.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (tipoTrabajos.length === 0) {
        throw new Error("No hay tipos de trabajo disponibles.");
    }

    return tipoTrabajos;
};

// Obtener un TipoTrabajo por su ID
export const getTipoTrabajoById = async (id) => {
    const tipoTrabajoId = parseInt(id, 10);
    if (isNaN(tipoTrabajoId)) {
        throw new Error("El ID del tipo de trabajo debe ser un número válido.");
    }

    const tipoTrabajo = await prisma.tipoTrabajo.findUnique({
        where: { id_tipo_trabajo: tipoTrabajoId },
    });

    if (!tipoTrabajo || !tipoTrabajo.estado) {
        throw new Error(`El tipo de trabajo con ID ${id} no existe o está inactivo.`);
    }

    return tipoTrabajo;
};

// Actualizar un TipoTrabajo
export const updateTipoTrabajo = async (id, nombre_trabajo, descripcion, estado) => {
    const tipoTrabajoId = parseInt(id, 10);

    if (isNaN(tipoTrabajoId)) {
        throw new Error("El ID del tipo de trabajo debe ser un número válido.");
    }

    // Verificar si el TipoTrabajo existe y está activo
    const tipoTrabajoExistente = await prisma.tipoTrabajo.findUnique({
        where: { id_tipo_trabajo: tipoTrabajoId },
    });

    if (!tipoTrabajoExistente || !tipoTrabajoExistente.estado) {
        throw new Error(`El tipo de trabajo con ID ${id} no existe o está inactivo.`);
    }

    // Verificar si el nuevo nombre ya está en uso por otro TipoTrabajo
    if (nombre_trabajo && nombre_trabajo !== tipoTrabajoExistente.nombre_trabajo) {
        const nombreEnUso = await prisma.tipoTrabajo.findUnique({
            where: { nombre_trabajo },
        });
        if (nombreEnUso) {
            throw new Error(`El tipo de trabajo con el nombre "${nombre_trabajo}" ya existe.`);
        }
    }

    // Actualizar el TipoTrabajo
    const tipoTrabajoActualizado = await prisma.tipoTrabajo.update({
        where: { id_tipo_trabajo: tipoTrabajoId },
        data: {
            nombre_trabajo: nombre_trabajo || tipoTrabajoExistente.nombre_trabajo,
            descripcion: descripcion !== undefined ? descripcion : tipoTrabajoExistente.descripcion,
            estado: estado !== undefined ? estado : tipoTrabajoExistente.estado,
            actualizado_en: new Date(),
        },
    });

    return tipoTrabajoActualizado;
};

// Eliminar (desactivar) un TipoTrabajo
export const deleteTipoTrabajo = async (id) => {
    const tipoTrabajoId = parseInt(id, 10);

    if (isNaN(tipoTrabajoId)) {
        throw new Error("El ID del tipo de trabajo debe ser un número válido.");
    }

    // Verificar si el TipoTrabajo existe y está activo
    const tipoTrabajo = await prisma.tipoTrabajo.findUnique({
        where: { id_tipo_trabajo: tipoTrabajoId },
    });

    if (!tipoTrabajo || !tipoTrabajo.estado) {
        throw new Error(`El tipo de trabajo con ID ${id} no existe o ya está inactivo.`);
    }

    // Desactivar el TipoTrabajo
    const tipoTrabajoDesactivado = await prisma.tipoTrabajo.update({
        where: { id_tipo_trabajo: tipoTrabajoId },
        data: { estado: false },
    });

    return tipoTrabajoDesactivado;
};