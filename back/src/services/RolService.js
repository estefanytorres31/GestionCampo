import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma= new PrismaClient();

export const createRol=async(nombre_rol)=>{

    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const nuevoRol=await prisma.rol.create(
        {
            data:{
                nombre_rol:nombre_rol,
                creado_en: fecha_creacion,
                actualizado_en:fecha_creacion,
            }
        }
    )
    return nuevoRol;
}

export const obtenerTodosLosRoles=async()=>{
    const roles=await prisma.rol.findMany({
        where:{
            estado:true
        }
    });
    return roles;
}

export const actualizarRol=async(id,nombre_rol)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const rolExistente=await prisma.rol.update(
        {
            where:{
                id:parseInt(id),
                estado:true,
            },
            data:{
                nombre_rol:nombre_rol,
                actualizado_en:fecha_creacion,
                
            }
        }
    )
    const rolActualizado={
        id:rolExistente.id,
        nombre_rol:rolExistente.nombre_rol
    }

    return rolActualizado;
}

export const eliminarRol=async(id)=>{
    await prisma.rol.update(
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
    const rol=await prisma.rol.findUnique({
        where:{
            id:parseInt(id),
            estado:true
        }
    });
    return rol;
}
