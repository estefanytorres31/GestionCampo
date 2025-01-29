import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// 🔹 Asignar un rol a un usuario
export const assignRolToUsuario = async (usuario_id, rol_id) => {
    if (isNaN(usuario_id) || isNaN(rol_id)) {
        throw new Error("El ID del usuario y del rol deben ser números válidos.");
    }

    // Verificar que el usuario existe y está activo
    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(usuario_id, 10) },
    });

    if (!usuario || !usuario.estado) {
        throw new Error(`El usuario con ID ${usuario_id} no existe o está inactivo.`);
    }

    // Verificar que el rol existe y está activo
    const rol = await prisma.rol.findUnique({
        where: { id: parseInt(rol_id, 10) },
    });

    if (!rol || !rol.estado) {
        throw new Error(`El rol con ID ${rol_id} no existe o está inactivo.`);
    }

    // Verificar si la relación ya existe
    const relacionExistente = await prisma.usuarioRol.findUnique({
        where: {
            usuario_roles_usuario_id_rol_id_key: {
                usuario_id: parseInt(usuario_id, 10),
                rol_id: parseInt(rol_id, 10),
            },
        },
    });

    if (relacionExistente) {
        if (relacionExistente.estado) {
            throw new Error("El usuario ya tiene asignado este rol y está activo.");
        } else {
            // Reactivar la relación existente
            return await prisma.usuarioRol.update({
                where: { id: relacionExistente.id },
                data: {
                    estado: true,
                    actualizado_en: getUTCTime(new Date()),
                },
            });
        }
    }

    // Crear la relación
    return await prisma.usuarioRol.create({
        data: {
            usuario_id: parseInt(usuario_id, 10),
            rol_id: parseInt(rol_id, 10),
            creado_en: getUTCTime(new Date()),
            actualizado_en: getUTCTime(new Date()),
        },
    });
};

// 🔹 Asignar múltiples roles a un usuario
export const assignMultipleRolesToUsuario = async (usuario_id, roles_ids) => {
    if (!usuario_id || !Array.isArray(roles_ids) || roles_ids.length === 0) {
        throw new Error("Debe proporcionar un usuario válido y al menos un rol.");
    }

    // Verificar si el usuario existe y está activo
    const usuario = await prisma.usuario.findUnique({ where: { id: usuario_id } });

    if (!usuario || !usuario.estado) {
        throw new Error(`El usuario con ID ${usuario_id} no existe o está inactivo.`);
    }

    // Verificar si los roles existen y están activos
    const rolesValidos = await prisma.rol.findMany({
        where: { id: { in: roles_ids }, estado: true },
    });

    if (rolesValidos.length !== roles_ids.length) {
        throw new Error("Algunos roles no existen o están inactivos.");
    }

    // Crear o actualizar los roles en una transacción
    const fecha_actualizacion = getUTCTime(new Date());
    const resultados = await prisma.$transaction(async (tx) => {
        const operaciones = roles_ids.map(async (rol_id) => {
            const relacionExistente = await tx.usuarioRol.findUnique({
                where: {
                    usuario_roles_usuario_id_rol_id_key: {
                        usuario_id,
                        rol_id,
                    },
                },
            });

            if (relacionExistente) {
                if (!relacionExistente.estado) {
                    return tx.usuarioRol.update({
                        where: { id: relacionExistente.id },
                        data: { estado: true, actualizado_en: fecha_actualizacion },
                    });
                }
                return null; // Si ya está activo, no hacer nada
            }

            return tx.usuarioRol.create({
                data: {
                    usuario_id,
                    rol_id,
                    creado_en: fecha_actualizacion,
                    actualizado_en: fecha_actualizacion,
                },
            });
        });

        return Promise.all(operaciones);
    });

    return { usuario_id, roles_asignados: roles_ids };
};

// 🔹 Remover un rol de un usuario (desactivarlo)
export const removeRolFromUsuario = async (usuario_id, rol_id) => {
    if (isNaN(usuario_id) || isNaN(rol_id)) {
        throw new Error("El ID del usuario y del rol deben ser números válidos.");
    }

    // Buscar la relación existente
    const relacion = await prisma.usuarioRol.findUnique({
        where: {
            usuario_roles_usuario_id_rol_id_key: {
                usuario_id: parseInt(usuario_id, 10),
                rol_id: parseInt(rol_id, 10),
            },
        },
    });

    if (!relacion || !relacion.estado) {
        throw new Error("El usuario no tiene este rol asignado o ya está inactivo.");
    }

    // Desactivar la relación
    return await prisma.usuarioRol.update({
        where: { id: relacion.id },
        data: {
            estado: false,
            actualizado_en: getUTCTime(new Date()),
        },
    });
};

// 🔹 Obtener todos los roles de un usuario
export const getRolesByUsuario = async (usuario_id) => {
    if (isNaN(usuario_id)) {
        throw new Error("El ID del usuario debe ser un número válido.");
    }

    const roles = await prisma.usuarioRol.findMany({
        where: { usuario_id: parseInt(usuario_id, 10), estado: true },
        include: { rol: true },
    });

    if (roles.length === 0) {
        throw new Error(`El usuario con ID ${usuario_id} no tiene roles asignados.`);
    }

    return roles.map(ur => ur.rol);
};

// 🔹 Obtener todos los usuarios con un rol específico
export const getUsuariosByRol = async (rol_id) => {
    if (isNaN(rol_id)) {
        throw new Error("El ID del rol debe ser un número válido.");
    }

    const usuarios = await prisma.usuarioRol.findMany({
        where: { rol_id: parseInt(rol_id, 10), estado: true },
        include: { usuario: true },
    });

    if (usuarios.length === 0) {
        throw new Error(`No hay usuarios asignados al rol con ID ${rol_id}.`);
    }

    return usuarios.map(ur => ur.usuario);
};
