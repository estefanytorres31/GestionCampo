import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Register entry attendance
export const registrarEntrada = async (
  id_usuario,
  id_embarcacion,
  id_orden_trabajo,
  id_puerto,
  latitud,
  longitud
) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);

    const newAsistencia = await prisma.asistencia.create({
      data: {
        id_usuario,
        id_embarcacion,
        id_orden_trabajo,
        id_puerto,
        fecha_hora: fecha_creacion,
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null,
        tipo: "entrada",
        estado: true,
        creado_en: fecha_creacion
      }
    });
    return newAsistencia;

};

// Register exit attendance
export const registrarSalida = async (
  id_usuario,
  id_embarcacion,
  id_orden_trabajo,
  id_puerto,
  latitud,
  longitud
) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);

    const newAsistencia = await prisma.asistencia.create({
      data: {
        id_usuario,
        id_embarcacion,
        id_orden_trabajo,
        id_puerto,
        fecha_hora: fecha_creacion,
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null,
        tipo: "salida",
        estado: true,
        creado_en: fecha_creacion
      }
    });
    return newAsistencia;

};

// Get all attendances
export const getAllAsistencias = async () => {

    const allAsistencias = await prisma.asistencia.findMany({
      where: {
        estado: true
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre_usuario: true,
            nombre_completo: true
          }
        },
        embarcacion: {
          select: {
            id_embarcacion: true,
            nombre: true
          }
        },
        orden_trabajo: {
          select: {
            id_orden_trabajo: true,
            estado: true
          }
        },
        puerto: {
          select: {
            id_puerto: true,
            nombre: true
          }
        }
      },
      orderBy: {
        fecha_hora: 'desc'
      }
    });
    return allAsistencias;

};

// Get attendance by ID
export const getAsistenciaById = async (id_asistencia) => {

    const asistencia = await prisma.asistencia.findUnique({
      where: {
        id_asistencia: parseInt(id_asistencia),
        estado: true
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre_usuario: true,
            nombre_completo: true
          }
        },
        embarcacion: {
          select: {
            id_embarcacion: true,
            nombre: true
          }
        },
        orden_trabajo: {
          select: {
            id_orden_trabajo: true,
            estado: true
          }
        },
        puerto: {
          select: {
            id_puerto: true,
            nombre: true
          }
        }
      }
    });
    return asistencia;

};

// Get user's attendance history
export const getAsistenciasByUsuario = async (id_usuario) => {

    const asistencias = await prisma.asistencia.findMany({
      where: {
        id_usuario: parseInt(id_usuario),
        estado: true
      },
      include: {
        embarcacion: {
          select: {
            id_embarcacion: true,
            nombre: true
          }
        },
        orden_trabajo: {
          select: {
            id_orden_trabajo: true,
            estado: true
          }
        },
        puerto: {
          select: {
            id_puerto: true,
            nombre: true
          }
        }
      },
      orderBy: {
        fecha_hora: 'desc'
      }
    });
    return asistencias;

};

// Update attendance record
export const updateAsistencia = async (id_asistencia, data) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const updatedAsistencia = await prisma.asistencia.update({
      where: {
        id_asistencia: parseInt(id_asistencia)
      },
      data: {
        ...data,
        actualizado_en: fecha_creacion
      }
    });
    return updatedAsistencia;

};

// Soft delete attendance record
export const deleteAsistencia = async (id_asistencia) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const deletedAsistencia = await prisma.asistencia.update({
      where: {
        id_asistencia: parseInt(id_asistencia)
      },
      data: {
        estado: false,
        actualizado_en: fecha_creacion
      }
    });

};

export const getAsistenciasByEmbarcaciones=async(id_embarcacion)=>{
    const asistencias=await prisma.asistencia.findMany({
        where:{
            id_embarcacion:parseInt(id_embarcacion),
            estado:true
        },
        include:{
            usuario:{
                select:{
                    id:true,
                    nombre_usuario:true,
                    nombre_completo:true
                }
            },
            orden_trabajo:{
                select:{
                    id_orden_trabajo:true,
                    estado:true
                }
            },
            puerto:{
                select:{
                    id_puerto:true,
                    nombre:true
                }
            }
        },
        orderBy:{
            fecha_hora:'desc'
        }
    })
    return asistencias
}