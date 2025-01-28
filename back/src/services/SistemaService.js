import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();


export const createSistema=async(nombre_sistema)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const nuevoSistema=await prisma.sistema.create({
        data:{
            nombre_sistema:nombre_sistema,
            creado_en:fecha_creacion,
            actualizado_en:fecha_creacion,
        }
    });
    return nuevoSistema;
}

export const getAllSistemas=async()=>{
    const sistemas=await prisma.sistema.findMany({
        where:{
            estado:true,
        }
    });
    return sistemas;
}

export const getSistemaById=async(id)=>{
    const sistema=await prisma.sistema.findUnique({
        where:{
            id:parseInt(id),
            estado:true,
        }
    });
    return sistema;
}

export const updateSistema=async(id,nombre_sistema,descripcion)=>{
    const todayISO = new Date().toISOString();
    const fecha_actualizacion = getUTCTime(todayISO);
    const sistema=await prisma.sistema.update({
        where:{
            id:parseInt(id),
            estado:true,
        },
        data:{
            nombreSistema:nombre_sistema,
            descripcion:descripcion,
            actualizadoEn:fecha_actualizacion,
        }
    });

    const sistemaActualizado={
        id:sistema.id,
        nombreSistema:sistema.nombreSistema,
        descripcion:sistema.descripcion,
        creadoEn:sistema.creadoEn,
        actualizadoEn:fecha_actualizacion,
    }
    return sistemaActualizado;

}

export const deleteSistema=async(id)=>{
    await prisma.sistema.update({
        where:{
            id:parseInt(id),
            estado:true,
        },
        data:{
            estado:false,
        }
    });
}