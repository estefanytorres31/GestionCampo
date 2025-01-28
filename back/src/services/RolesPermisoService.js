// src/services/RolesPermisoService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Asignar un permiso a un rol
export const assignPermisoToRol = async (rol_id, permiso_id) => {
    if (isNaN(rol_id) || isNaN(permiso_id)) {
        throw new Error("El ID del rol y del permiso deben ser números válidos.");
    }

    // Verificar si el rol existe y está activo
    const rol = await prisma.rol.findUnique({
        where: { id: parseInt(rol_id, 10) },
    });

    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${rol_id} no existe o está inactivo.`);
    }

    // Verificar si el permiso existe y está activo
    const permiso = await prisma.permiso.findUnique({
        where: { id: parseInt(permiso_id, 10) },
    });

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

    if (relacionExistente && relacionExistente.estado) {
        throw new Error("La relación entre el rol y el permiso ya existe y está activa.");
    }

    if (relacionExistente && !relacionExistente.estado) {
        // Reactivar la relación existente
        const relacionReactivada = await prisma.rolesPermiso.update({
            where: {
                id: relacionExistente.id,
            },
            data: { estado: true },
        });
        return relacionReactivada;
    }

    // Crear la relación
    const nuevaRelacion = await prisma.rolesPermiso.create({
        data: {
            rol_id: parseInt(rol_id, 10),
            permiso_id: parseInt(permiso_id, 10),
        },
    });

    return nuevaRelacion;
};

// Quitar un permiso de un rol
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
        throw new Error("La relación entre el rol y el permiso no existe o ya está inactiva.");
    }

    // Desactivar la relación
    const relacionDesactivada = await prisma.rolesPermiso.update({
        where: { id: relacion.id },
        data: { estado: false },
    });

    return relacionDesactivada;
};

// Obtener todos los permisos asignados a un rol
export const getPermisosByRol = async (rol_id) => {
    if (isNaN(rol_id)) {
        throw new Error("El ID del rol debe ser un número válido.");
    }

    // Verificar si el rol existe y está activo
    const rol = await prisma.rol.findUnique({
        where: { id: parseInt(rol_id, 10) },
    });

    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${rol_id} no existe o está inactivo.`);
    }

    const permisos = await prisma.rolesPermiso.findMany({
        where: {
            rol_id: parseInt(rol_id, 10),
            estado: true,
        },
        include: {
            permiso: true,
        },
    });

    return permisos.map(rp => rp.permiso);
};

// Obtener todos los roles que tienen un permiso específico
export const getRolesByPermiso = async (permiso_id) => {
    if (isNaN(permiso_id)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    // Verificar si el permiso existe y está activo
    const permiso = await prisma.permiso.findUnique({
        where: { id: parseInt(permiso_id, 10) },
    });

    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${permiso_id} no existe o está inactivo.`);
    }

    const roles = await prisma.rolesPermiso.findMany({
        where: {
            permiso_id: parseInt(permiso_id, 10),
            estado: true,
        },
        include: {
            rol: true,
        },
    });

    return roles.map(rp => rp.rol);
};
