import { PrismaClient } from "@prisma/client";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Registrar llegada de una embarcación
export const registrarLlegada = async (embarcacion_id, puerto_id, fecha_llegada) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
  
    // Validar que embarcacion_id y puerto_id sean números
    if (isNaN(embarcacion_id) || isNaN(puerto_id)) {
      throw new Error("El ID de la embarcación y el puerto deben ser números válidos.");
    }
  
    // Validar que la embarcación existe
    const embarcacionExiste = await prisma.embarcacion.findUnique({
      where: { id_embarcacion: parseInt(embarcacion_id, 10) },
    });
    if (!embarcacionExiste) {
      throw new Error("La embarcación no existe.");
    }
  
    // Validar que el puerto existe
    const puertoExiste = await prisma.puerto.findUnique({
      where: { id_puerto: parseInt(puerto_id, 10) },
    });
    if (!puertoExiste) {
      throw new Error("El puerto no existe.");
    }
  
    // Verificar si la embarcación ya tiene un registro de llegada pendiente (sin salida)
    const llegadaPendiente = await prisma.historialPuerto.findFirst({
      where: {
        embarcacion_id: parseInt(embarcacion_id, 10),
        fecha_salida: null,
        estado: true,
      },
      orderBy: { fecha_llegada: "desc" }
    });
  
    // Si existe un registro pendiente, registramos la salida primero
    if (llegadaPendiente) {
      await prisma.historialPuerto.update({
        where: {
          id_historial: llegadaPendiente.id_historial,
        },
        data: {
          // Aquí usamos la fecha_llegada que se recibe para marcar la salida,
          // aunque podrías ajustarlo (por ejemplo, restando un minuto) si lo requieres.
          fecha_salida: new Date(fecha_llegada),
          actualizado_en: fecha_creacion,
        },
      });
    }
  
    // Registrar la nueva llegada
    const nuevoRegistro = await prisma.historialPuerto.create({
      data: {
        embarcacion_id: parseInt(embarcacion_id, 10),
        puerto_id: parseInt(puerto_id, 10),
        fecha_llegada: new Date(fecha_llegada),
        creado_en: fecha_creacion,
        actualizado_en: fecha_creacion,
      },
    });
  
    return nuevoRegistro;
  };
  
  // Registrar salida de una embarcación
  export const registrarSalida = async (embarcacion_id, fecha_salida) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
  
    if (isNaN(embarcacion_id)) {
      throw new Error("El ID de la embarcación debe ser un número válido.");
    }
  
    // Buscar el último registro de llegada sin salida
    const registroPendiente = await prisma.historialPuerto.findFirst({
      where: {
        embarcacion_id: parseInt(embarcacion_id, 10),
        fecha_salida: null,
        estado: true,
      },
      orderBy: {
        fecha_llegada: "desc",
      },
    });
  
    if (!registroPendiente) {
      throw new Error("No se encontró un registro de llegada pendiente para esta embarcación.");
    }
  
    // Registrar la salida
    const registroActualizado = await prisma.historialPuerto.update({
      where: {
        id_historial: registroPendiente.id_historial,
      },
      data: {
        fecha_salida: new Date(fecha_salida),
        actualizado_en: fecha_creacion,
      },
    });
  
    return registroActualizado;
  };
  
  // Consultar puerto actual de una embarcación
  export const obtenerPuertoActual = async (embarcacion_id) => {
    if (isNaN(embarcacion_id)) {
      throw new Error("El ID de la embarcación debe ser un número válido.");
    }
  
    const puertoActual = await prisma.historialPuerto.findFirst({
      where: {
        embarcacion_id: parseInt(embarcacion_id, 10),
        fecha_salida: null,
        estado: true,
      },
      include: {
        puerto: true,
      },
    });
  
    if (!puertoActual) {
      throw new Error("La embarcación no se encuentra actualmente en ningún puerto.");
    }
  
    return puertoActual.puerto;
  };
  
// Consultar historial de puertos de una embarcación
export const obtenerHistorialPuertos = async (embarcacion_id, limit = 10) => {
    if (isNaN(embarcacion_id)) {
        throw new Error("El ID de la embarcación debe ser un número válido.");
    }

    const historial = await prisma.historialPuerto.findMany({
        where: { 
            embarcacion_id: parseInt(embarcacion_id, 10), 
            estado: true 
        },
        orderBy: { fecha_llegada: "desc" },
        take: limit,
        include: {
            puerto: true,
        },
    });

    if (historial.length === 0) {
        throw new Error("No se encontró historial de puertos para esta embarcación.");
    }

    return historial;
};
