import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export const createUser=async(nombre_usuario, contrasena_hash, nombre_completo, email)=>{
    const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
    const newUser = await prisma.user.create({
        data:{
            nombre_usuario: nombre_usuario,
            contrasena_hash: hashedPassword,
            nombre_completo: nombre_completo,
            email: email
        }
    });
    return newUser;
}

export const getUserByUsername=async(nombre_usuario)=>{
    const user = await prisma.user.findFirst({
        where:{
            nombre_usuario: nombre_usuario
        }
    });
    return user;
}

export const getUserById=async(id)=>{
    const user = await prisma.user.findFirst({
        where:{
            id:  parseInt(id)
        }
    });
    return user;

}

export const updateUser=async(id,nombre_usuario, nombre_completo, email)=>{
    const usuarioExistente = await prisma.user.update({
        where:{
            id: parseInt(id)
        },
        data:{
            nombre_usuario: nombre_usuario,
            nombre_completo: nombre_completo,
            email: email
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
            id: parseInt(id)
        }
    });
}

export const getAllUsers = async()=>{
    const users = await prisma.user.findMany({
        where:{
            estado: true
        }
    });
    return users;
}