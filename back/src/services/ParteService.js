import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createParte=async(nombre_parte)=>{
    const newParte=await prisma.parte.create({
        data:{
            nombre:nombre_parte
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