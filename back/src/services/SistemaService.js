import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear o reactivar un sistema
export const createSistema = async (nombre_sistema, descripcion) => {
    if (!nombre_sistema) {
        throw new Error("El nombre del sistema es obligatorio.");
    }

    // Verificar si el sistema ya existe
    const sistemaExistente = await prisma.sistema.findUnique({
        where: { nombre_sistema },
    });

    if (sistemaExistente) {
        if (sistemaExistente.estado) {
            throw new Error(`El sistema con el nombre "${nombre_sistema}" ya existe y está activo.`);
        } else {
            // Reactivar el sistema existente
            const fecha_actualizacion = getUTCTime(new Date().toISOString());

            const sistemaReactivado = await prisma.sistema.update({
                where: { id_sistema: sistemaExistente.id_sistema },
                data: {
                    estado: true,
                    descripcion: descripcion || sistemaExistente.descripcion,
                    actualizado_en: fecha_actualizacion,
                },
            });

            return sistemaReactivado;
        }
    }

    // Crear un nuevo sistema si no existe
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const nuevoSistema = await prisma.sistema.create({
        data: {
            nombre_sistema,
            descripcion,
            creado_en: fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    return nuevoSistema;
};

// Obtener todos los sistemas activos
export const getAllSistemas = async () => {
    const sistemas = await prisma.sistema.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (sistemas.length === 0) {
        throw new Error("No hay sistemas disponibles.");
    }

    return sistemas;
};

// Obtener un sistema por su ID
export const getSistemaById = async (id) => {
    const sistemaId = parseInt(id, 10);
    if (isNaN(sistemaId)) {
        throw new Error("El ID del sistema debe ser un número válido.");
    }

    const sistema = await prisma.sistema.findUnique({
        where: { id_sistema: sistemaId },
    });

    if (!sistema || !sistema.estado) {
        throw new Error(`El sistema con ID ${id} no existe o está inactivo.`);
    }

    return sistema;
};

// Actualizar un sistema
export const updateSistema = async (id, nombre_sistema, descripcion, estado) => {
    const sistemaId = parseInt(id, 10);

    if (isNaN(sistemaId)) {
        throw new Error("El ID del sistema debe ser un número válido.");
    }

    // Verificar si el sistema existe y está activo
    const sistemaExistente = await prisma.sistema.findUnique({
        where: { id_sistema: sistemaId },
    });

    if (!sistemaExistente || !sistemaExistente.estado) {
        throw new Error(`El sistema con ID ${id} no existe o está inactivo.`);
    }

    // Verificar si el nuevo nombre ya está en uso por otro sistema
    if (nombre_sistema && nombre_sistema !== sistemaExistente.nombre_sistema) {
        const nombreEnUso = await prisma.sistema.findUnique({
            where: { nombre_sistema },
        });
        if (nombreEnUso) {
            throw new Error(`El sistema con el nombre "${nombre_sistema}" ya existe.`);
        }
    }

    const fecha_actualizacion = getUTCTime(new Date().toISOString());

    // Actualizar el sistema
    const sistemaActualizado = await prisma.sistema.update({
        where: { id_sistema: sistemaId },
        data: {
            nombre_sistema: nombre_sistema || sistemaExistente.nombre_sistema,
            descripcion: descripcion !== undefined ? descripcion : sistemaExistente.descripcion,
            estado: estado !== undefined ? estado : sistemaExistente.estado,
            actualizado_en: fecha_actualizacion,
        },
    });

    return sistemaActualizado;
};

// Eliminar (desactivar) un sistema
export const deleteSistema = async (id) => {
    const sistemaId = parseInt(id, 10);

    if (isNaN(sistemaId)) {
        throw new Error("El ID del sistema debe ser un número válido.");
    }

    // Verificar si el sistema existe y está activo
    const sistema = await prisma.sistema.findUnique({
        where: { id_sistema: sistemaId },
    });

    if (!sistema || !sistema.estado) {
        throw new Error(`El sistema con ID ${id} no existe o ya está inactivo.`);
    }

    // Desactivar el sistema
    const sistemaDesactivado = await prisma.sistema.update({
        where: { id_sistema: sistemaId },
        data: { estado: false },
    });

    return sistemaDesactivado;
};
