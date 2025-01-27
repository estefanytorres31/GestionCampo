import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient();

export const createRol=async(nombre_rol)=>{
    const nuevoRol=await prisma.roles.create(
        {
            data:{
                nombre:nombre_rol
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
                nombre:nombre_rol
            }
        }
    )
    const rolActualizado={
        id:rolExistente.id,
        nombre:rolExistente.nombre
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