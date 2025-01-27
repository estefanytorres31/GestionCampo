import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient();

export const createRol=async(nombre_rol)=>{
    const nuevoRol=await prisma.roles.create(
        {
            data:{
                nombreRol:nombre_rol
            }
        }
    )
    return nuevoRol;
}

export const obtenerTodosLosRoles=async()=>{
    const roles=await prisma.roles.findMany({
        where:{
            estado:true
        }
    });
    return roles;
}

export const actualizarRol=async(id_rol,nombre_rol)=>{
    const rolExistente=await prisma.roles.update(
        {
            where:{
                id:id_rol
            },
            data:{
                nombreRol:nombre_rol
            }
        }
    )
    const rolActualizado={
        id:rolExistente.id,
        nombre_rol:rolExistente.nombreRol
    }

    return rolActualizado;
}

export const eliminarRol=async(id_rol)=>{
    await prisma.roles.update(
        {
            where:{
                id:id_rol
            },
            data:{
                estado:false
            }
        }
    )
}

export const getRolById=async(id)=>{
    const rol=await prisma.roles.findOne({
        where:{
            id:id,
            estado:true
        }
    });
    return rol;
}
