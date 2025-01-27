import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export const createUser=async(nombre_usuario, contrasena_hash, nombre_completo, email)=>{
    const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
    const newUser = await prisma.usuario.create({
        data:{
            nombreUsuario: nombre_usuario,
            contrasenaHash: hashedPassword,
            nombreCompleto: nombre_completo,
            email: email,
        }
    });
    return newUser;
}

export const getUserByUsername=async(nombre_usuario)=>{
    const user = await prisma.usuario.findFirst({
        where:{
            nombreUsuario: nombre_usuario
        }
    });
    return user;
}

export const getUserById=async(id)=>{
    const user = await prisma.usuario.findFirst({
        where:{
            id:  parseInt(id),
            estado: true
        }
    });
    return user;

}

export const updateUser=async(id,nombre_usuario, nombre_completo, email)=>{
    const usuarioExistente = await prisma.usuario.update({
        where:{
            id: parseInt(id)
        },
        data:{
            nombreUsuario: nombre_usuario,
            nombreCompleto: nombre_completo,
            email: email
        }
    });

    const usuarioActualizado={
        id: usuarioExistente.id,
        nombre_usuario: usuarioExistente.nombreUsuario,
        nombre_completo: usuarioExistente.nombreCompleto,
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
    const users = await prisma.usuario.findMany({
        where:{
            estado: true
        }
    });
    return users;
}