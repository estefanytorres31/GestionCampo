import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo rol
export const createRol = async (nombre_rol, descripcion) => {
    if (!nombre_rol) {
        throw new Error("El nombre del rol es obligatorio.");
    }

    const rolExistente = await prisma.rol.findUnique({
        where: { nombre_rol },
    });

    if (rolExistente) {
        throw new Error(`El rol con el nombre "${nombre_rol}" ya existe.`);
    }

    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const nuevoRol = await prisma.rol.create({
        data: {
            nombre_rol,
            descripcion,
            creado_en: fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    return nuevoRol;
};

// Obtener todos los roles
export const getAllRoles = async () => {
    const roles = await prisma.rol.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (roles.length === 0) {
        throw new Error("No hay roles disponibles.");
    }

    return roles;
};

// Obtener un rol por su ID
export const getRolById = async (id) => {
    if (!id) {
        throw new Error("El ID del rol es obligatorio.");
    }

    const rol = await prisma.rol.findUnique({
        where: { id: parseInt(id) },
    });

    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${id} no existe o está inactivo.`);
    }

    return rol;
};

// Actualizar un rol
export const updateRol = async (id, nombre_rol, descripcion) => {
    if (!id || !nombre_rol) {
        throw new Error("El ID y el nombre del rol son obligatorios.");
    }

    const rol = await prisma.rol.findUnique({
        where: { id: parseInt(id) },
    });

    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${id} no existe o está inactivo.`);
    }

    const todayISO = new Date().toISOString();
    const fecha_actualizacion = getUTCTime(todayISO);

    const rolActualizado = await prisma.rol.update({
        where: { id: parseInt(id) },
        data: {
            nombre_rol,
            descripcion,
            actualizado_en: fecha_actualizacion,
        },
    });

    return rolActualizado;
};

// Eliminar (desactivar) un rol
export const deleteRol = async (id) => {
    if (!id) {
        throw new Error("El ID del rol es obligatorio.");
    }

    const rol = await prisma.rol.findUnique({
        where: { id: parseInt(id) },
    });

    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${id} no existe o ya está inactivo.`);
    }

    const rolDesactivado = await prisma.rol.update({
        where: { id: parseInt(id) },
        data: { estado: false },
    });

    return rolDesactivado;
};
