import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


export const createUsuario = async (nombre_usuario, contrasena_hash, nombre_completo, email, roles_ids) => {
    if (!roles_ids || roles_ids.length === 0) {
        throw new Error("Debe proporcionar al menos un rol para el usuario");
    }

    const result = await prisma.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
        
        const newUser = await tx.usuario.create({
            data: {
                nombreUsuario: nombre_usuario,
                contrasenaHash: hashedPassword,
                nombreCompleto: nombre_completo,
                email: email,
                roles: {
                    create: roles_ids.map(rolId => ({
                        rol: {
                            connect: { id: rolId }
                        }
                    }))
                }
            },
            include: {
                roles: {
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