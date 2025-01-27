import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma= new PrismaClient();

export const createRol=async(nombre_rol)=>{

    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const nuevoRol=await prisma.roles.create(
        {
            data:{
                nombreRol:nombre_rol,
                creadoEn: fecha_creacion,
                actualizadoEn:fecha_creacion,
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

export const actualizarRol=async(id,nombre_rol)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const rolExistente=await prisma.roles.update(
        {
            where:{
                id:parseInt(id),
                estado:true,
            },
            data:{
                nombreRol:nombre_rol,
                actualizadoEn:fecha_creacion,
                
            }
        }
    )
    const rolActualizado={
        id:rolExistente.id,
        nombre_rol:rolExistente.nombreRol
    }

    return rolActualizado;
}

export const eliminarRol=async(id)=>{
    await prisma.roles.update(
        {
            where:{
                id:parseInt(id),
                estado:true,
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
            id:parseInt(id),
            estado:true
        }
    });
    return rol;
}
