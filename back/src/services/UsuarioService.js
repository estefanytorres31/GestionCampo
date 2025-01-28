import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();


export const createUsuario = async (nombre_usuario, contrasena_hash, nombre_completo, email, roles_ids) => {
    if (!roles_ids || roles_ids.length === 0) {
        throw new Error("Debe proporcionar al menos un rol para el usuario");
    }

    const result = await prisma.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
        const todayISO = new Date().toISOString();
        const fecha_creacion = getUTCTime(todayISO);
        
        const newUser = await tx.usuario.create({
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
                            connect: { id: rolId }
                        }
                    }))
                }
            },
            include: {
                usuario_roles: {
                    include: {
                        rol: true
                    }
                }
            }
        });

        return newUser;
    });

    return result;
};

export const getUserByUsername=async(nombre_usuario)=>{
    const user = await prisma.usuario.findFirst({
        where:{
            nombre_usuario: nombre_usuario,
            estado: true
        }
    });
    return user;
}

export const getUserById = async (id) => {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
        throw new Error("El ID proporcionado no es válido");
    }
    
    const user = await prisma.usuario.findFirst({
        where: {
            id: userId,
            estado: true
        }
    });
    
    return user;
};

export const updateUser=async(id,nombre_usuario, nombre_completo, email)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const usuarioExistente = await prisma.usuario.update({
        where:{
            id: parseInt(id),
            estado: true
        },
        data:{
            nombre_usuario: nombre_usuario,
            nombre_completo: nombre_completo,
            email: email,
            actualizado_en: fecha_creacion
        }
    });

    const usuarioActualizado={
        id: usuarioExistente.id,
        nombre_usuario: usuarioExistente.nombre_usuario,
        nombre_completo: usuarioExistente.nombre_completo,
        email: usuarioExistente.email
    }

    return usuarioActualizado;
}

export const deleteUser=async(id)=>{
    await prisma.user.delete({
        where:{
            id: parseInt(id),
            estado: true
        }
    });
}

export const getAllUsers = async()=>{
    const users = await prisma.usuario.findMany({
        where:{
            estado: true
        }
    });
    return users;
}