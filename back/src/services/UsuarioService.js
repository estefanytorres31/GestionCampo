import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo usuario
export const createUsuario = async (nombre_usuario, contrasena_hash, nombre_completo, email, roles_ids) => {
    if (!roles_ids || roles_ids.length === 0) {
        throw new Error("Debe proporcionar al menos un rol para el usuario.");
    }

    const usuarioExistente = await prisma.usuario.findUnique({
        where: { nombre_usuario },
    });

    if (usuarioExistente) {
        throw new Error(`El usuario con el nombre "${nombre_usuario}" ya existe.`);
    }

    const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
    const fecha_creacion = getUTCTime(new Date().toISOString());

    const newUser = await prisma.$transaction(async (tx) => {
        return tx.usuario.create({
            data: {
                nombre_usuario: nombre_usuario,
                contrasena_hash: hashedPassword,
                nombre_completo: nombre_completo,
                email: email,
                creado_en:fecha_creacion,
                actualizado_en:fecha_creacion,
                usuario_roles: {
                    create: roles_ids.map(rolId => ({
                        rol: {
                            connect: { id: rolId },
                        },
                    })),
                },
            },
            include: {
                usuario_roles: {
                    include: {
                        rol: true,
                    },
                },
            },
        });
    });

    return newUser;
};

export const getUserByUsername=async(nombre_usuario)=>{
    const user = await prisma.usuario.findFirst({
        where:{
            nombre_usuario: nombre_usuario,
            estado: true
        }
    });

    if (user.length === 0) {
        throw new Error("No hay usuarios disponibles.");
    }

    return user;
};


// Obtener un usuario por su ID
export const getUserById = async (id) => {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
        throw new Error("El ID proporcionado no es válido.");
    }

    const user = await prisma.usuario.findFirst({
        where: { id: userId, estado: true },
        include: {
            usuario_roles: {
                include: {
                    rol: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error(`El usuario con ID ${id} no existe o está inactivo.`);
    }

    return user;
};

// Actualizar un usuario
export const updateUser = async (id, nombre_usuario, nombre_completo, email) => {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        throw new Error("El ID proporcionado no es válido.");
    }

    const user = await prisma.usuario.findUnique({
        where: { id: userId },
    });

    if (!user || !user.estado) {
        throw new Error(`El usuario con ID ${id} no existe o está inactivo.`);
    }

    const fecha_actualizacion = getUTCTime(new Date().toISOString());

    const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: {
            nombre_usuario,
            nombre_completo,
            email,
            actualizado_en: fecha_actualizacion,
        },
    });

    const usuario={
        id:updatedUser.id,
        nombre_usuario:updatedUser.nombre_usuario,
        nombre_completo:updatedUser.nombre_completo,
        email:updatedUser.email,
        creado_en:updatedUser.creado_en,
        actualizado_en: updatedUser.actualizado_en,
    }
    return usuario;
};

// Eliminar (desactivar) un usuario
export const deleteUser = async (id) => {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        throw new Error("El ID proporcionado no es válido.");
    }

    const user = await prisma.usuario.findUnique({
        where: { id: userId },
    });

    if (!user || !user.estado) {
        throw new Error(`El usuario con ID ${id} no existe o ya está inactivo.`);
    }

    const deletedUser = await prisma.usuario.update({
        where: { id: userId },
        data: { estado: false },
    });

    return deletedUser;
};
