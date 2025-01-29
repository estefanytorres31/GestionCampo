import { getUTCTime } from "../utils/Time.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Asignar un permiso a un rol
export const assignPermisoToRol = async (rol_id, permiso_id) => {
    if (isNaN(rol_id) || isNaN(permiso_id)) {
        throw new Error("El ID del rol y del permiso deben ser números válidos.");
    }

    // Verificar si el rol existe y está activo
    const rol = await prisma.rol.findUnique({ where: { id: parseInt(rol_id, 10) } });
    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${rol_id} no existe o está inactivo.`);
    }

    // Verificar si el permiso existe y está activo
    const permiso = await prisma.permiso.findUnique({ where: { id: parseInt(permiso_id, 10) } });
    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${permiso_id} no existe o está inactivo.`);
    }

    // Verificar si la relación ya existe
    const relacionExistente = await prisma.rolesPermiso.findUnique({
        where: {
            roles_permisos_rol_id_permiso_id_key: {
                rol_id: parseInt(rol_id, 10),
                permiso_id: parseInt(permiso_id, 10),
            },
        },
    });

    if (relacionExistente) {
        if (relacionExistente.estado) {
            throw new Error("El permiso ya está asignado a este rol.");
        } else {
            // Reactivar la relación existente
            return await prisma.rolesPermiso.update({
                where: { id: relacionExistente.id },
                data: {
                    estado: true,
                    actualizado_en: getUTCTime(new Date()),
                },
            });
        }
    }

    // Crear la nueva relación con fecha UTC
    return await prisma.rolesPermiso.create({
        data: {
            rol_id: parseInt(rol_id, 10),
            permiso_id: parseInt(permiso_id, 10),
            creado_en: getUTCTime(new Date()),
            actualizado_en: getUTCTime(new Date()),
        },
    });
};

// Quitar un permiso de un rol (desactivarlo)
export const removePermisoFromRol = async (rol_id, permiso_id) => {
    if (isNaN(rol_id) || isNaN(permiso_id)) {
        throw new Error("El ID del rol y del permiso deben ser números válidos.");
    }

    // Buscar la relación existente
    const relacion = await prisma.rolesPermiso.findUnique({
        where: {
            roles_permisos_rol_id_permiso_id_key: {
                rol_id: parseInt(rol_id, 10),
                permiso_id: parseInt(permiso_id, 10),
            },
        },
    });

    if (!relacion || !relacion.estado) {
        throw new Error("El permiso no está asignado a este rol o ya está inactivo.");
    }

    // Desactivar la relación y actualizar la fecha
    return await prisma.rolesPermiso.update({
        where: { id: relacion.id },
        data: {
            estado: false,
            actualizado_en: getUTCTime(new Date()),
        },
    });
};

// Obtener todos los permisos activos asignados a un rol
export const getPermisosByRol = async (rol_id) => {
    if (isNaN(rol_id)) {
        throw new Error("El ID del rol debe ser un número válido.");
    }

    // Verificar que el rol exista y esté activo
    const rol = await prisma.rol.findUnique({ where: { id: parseInt(rol_id, 10) } });
    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${rol_id} no existe o está inactivo.`);
    }

    const permisos = await prisma.rolesPermiso.findMany({
        where: { rol_id: parseInt(rol_id, 10), estado: true },
        include: { permiso: true },
    });

    return permisos.map(rp => rp.permiso);
};

// Obtener todos los roles que tienen un permiso específico
export const getRolesByPermiso = async (permiso_id) => {
    if (isNaN(permiso_id)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    // Verificar que el permiso exista y esté activo
    const permiso = await prisma.permiso.findUnique({ where: { id: parseInt(permiso_id, 10) } });
    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${permiso_id} no existe o está inactivo.`);
    }

    const roles = await prisma.rolesPermiso.findMany({
        where: { permiso_id: parseInt(permiso_id, 10), estado: true },
        include: { rol: true },
    });

    return roles.map(rp => rp.rol);
};

// Obtener todos los permisos asignados a roles activos
export const getAllRolesPermisos = async () => {
    const rolesPermisos = await prisma.rolesPermiso.findMany({
        where: { estado: true },
        include: { rol: true, permiso: true },
        orderBy: { creado_en: "desc" },
    });

    if (rolesPermisos.length === 0) {
        throw new Error("No hay relaciones activas entre roles y permisos.");
    }

    return rolesPermisos;
};
