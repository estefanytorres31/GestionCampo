import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

export const createParte=async(nombre_parte)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const newParte=await prisma.parte.create({
        data:{
            nombre:nombre_parte,
            creado_en:fecha_creacion,
            actualizado_en:fecha_creacion
        }
    });
    return newParte;
}

export const getAllPartes=async()=>{
    const partes=await prisma.parte.findMany({
        where:{
            estado:true
        }
    });
    return partes;
}

export const getParteById=async(id_parte)=>{
    const parte=await prisma.parte.findUnique({
        where:{
            id_parte:parseInt(id_parte),
            estado:true
        }
    });
    return parte;
}

export const updateParte=async(id_parte,nombre_parte)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const updatedParte=await prisma.parte.update({
        where:{
            id_parte:parseInt(id_parte),
            estado:true
        },
        data:{
            nombre:nombre_parte,
            actualizado_en:fecha_creacion
        }
    });
    return updatedParte;
}


export const deleteParte=async(id_parte)=>{
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    await prisma.parte.update({
        where:{
            id_parte:parseInt(id_parte),
            estado:true
        },
        data:{
            estado:false,
            actualizado_en:fecha_creacion
        }
    });
}