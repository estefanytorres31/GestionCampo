// src/services/PermisoService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear un nuevo permiso
export const createPermiso = async (nombre, descripcion) => {
    if (!nombre) {
        throw new Error("El nombre del permiso es obligatorio.");
    }

    // Verificar si el permiso ya existe
    const permisoExistente = await prisma.permiso.findUnique({
        where: { nombre },
    });

    if (permisoExistente) {
        throw new Error(`El permiso con el nombre "${nombre}" ya existe.`);
    }

    // Crear el permiso
    const nuevoPermiso = await prisma.permiso.create({
        data: {
            nombre,
            descripcion,
        },
    });

    return nuevoPermiso;
};

// Obtener todos los permisos activos
export const getAllPermisos = async () => {
    const permisos = await prisma.permiso.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (permisos.length === 0) {
        throw new Error("No hay permisos disponibles.");
    }

    return permisos;
};

// Obtener un permiso por su ID
export const getPermisoById = async (id) => {
    const permisoId = parseInt(id, 10);
    if (isNaN(permisoId)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    const permiso = await prisma.permiso.findUnique({
        where: { id: permisoId },
    });

    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${id} no existe o está inactivo.`);
    }

    return permiso;
};

// Actualizar un permiso
export const updatePermiso = async (id, nombre, descripcion, estado) => {
    const permisoId = parseInt(id, 10);

    if (isNaN(permisoId)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    // Verificar si el permiso existe
    const permisoExistente = await prisma.permiso.findUnique({
        where: { id: permisoId },
    });

    if (!permisoExistente || !permisoExistente.estado) {
        throw new Error(`El permiso con ID ${id} no existe o está inactivo.`);
    }

    // Verificar si el nuevo nombre ya está en uso
    if (nombre && nombre !== permisoExistente.nombre) {
        const nombreEnUso = await prisma.permiso.findUnique({
            where: { nombre },
        });
        if (nombreEnUso) {
            throw new Error(`El permiso con el nombre "${nombre}" ya existe.`);
        }
    }

    // Actualizar el permiso
    const permisoActualizado = await prisma.permiso.update({
        where: { id: permisoId },
        data: {
            nombre: nombre || permisoExistente.nombre,
            descripcion: descripcion !== undefined ? descripcion : permisoExistente.descripcion,
            estado: estado !== undefined ? estado : permisoExistente.estado,
        },
    });

    return permisoActualizado;
};

// Eliminar (desactivar) un permiso
export const deletePermiso = async (id) => {
    const permisoId = parseInt(id, 10);

    if (isNaN(permisoId)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    // Verificar si el permiso existe y está activo
    const permiso = await prisma.permiso.findUnique({
        where: { id: permisoId },
    });

    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${id} no existe o ya está inactivo.`);
    }

    // Desactivar el permiso
    const permisoDesactivado = await prisma.permiso.update({
        where: { id: permisoId },
        data: { estado: false },
    });

    return permisoDesactivado;
};
