import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Asignar un Trabajo a una Embarcación (Crear o Reactivar Orden de Trabajo)
 * @param {Object} data - Datos para asignar la orden de trabajo
 * @returns {Promise<Object>} - La orden de trabajo creada o reactivada
 */
export const asignarTrabajoAEmbarcacion = async (data) => {
  const {
    id_tipo_trabajo,
    id_embarcacion,
    id_puerto,
    id_jefe_asigna,
    codigo,
    comentarios = null, // Opcional
    motorista = null, // Opcional
    supervisor = null, // Opcional
  } = data;

  // ✅ Validaciones básicas
  if (
    isNaN(id_tipo_trabajo) ||
    isNaN(id_embarcacion) ||
    isNaN(id_puerto) ||
    isNaN(id_jefe_asigna)
  ) {
    throw new Error("Todos los IDs proporcionados deben ser números válidos.");
  }

  const fecha_actualizacion = getUTCTime(new Date().toISOString());

  return await prisma.$transaction(async (prisma) => {
    let ordenTrabajo;
    let mensaje;

    if (codigo) {
      // 🔹 Buscar una orden existente con el mismo código
      ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { codigo },
      });

      if (ordenTrabajo) {
        if (ordenTrabajo.estado === "inactivo") {
          // 🔹 Reactivar la orden si está inactiva
          ordenTrabajo = await prisma.ordenTrabajo.update({
            where: { codigo },
            data: {
              estado: "pendiente",
              comentarios: comentarios || ordenTrabajo.comentarios,
              motorista: motorista || ordenTrabajo.motorista,
              supervisor: supervisor || ordenTrabajo.supervisor,
              fecha_asignacion: fecha_actualizacion,
              actualizado_en: fecha_actualizacion,
            },
          });
          mensaje = "Orden de trabajo reactivada exitosamente.";
        } else {
          throw new Error(
            `Una orden de trabajo con el código "${codigo}" ya existe y está activa.`
          );
        }
      }
    }

    if (!ordenTrabajo) {
      // 🔹 Crear una nueva Orden de Trabajo
      ordenTrabajo = await prisma.ordenTrabajo.create({
        data: {
          id_tipo_trabajo,
          id_embarcacion,
          id_puerto,
          id_jefe_asigna,
          codigo,
          comentarios,
          motorista,
          supervisor,
          fecha_asignacion: fecha_actualizacion,
          estado: "pendiente",
          creado_en: fecha_actualizacion,
          actualizado_en: fecha_actualizacion,
        },
      });
      mensaje = "Trabajo asignado a la embarcación exitosamente.";
    }

    return { mensaje, ordenTrabajo };
  });
};

/**
 * Obtener todas las órdenes de trabajo activas
 * @returns {Promise<Array>} - Lista de órdenes de trabajo activas
 * @throws {Error} - Si no hay órdenes de trabajo activas
 */
export const getAllOrdenesTrabajo = async () => {
  const ordenesTrabajo = await prisma.ordenTrabajo.findMany({
    where: {
      estado: {
        not: "inactivo", // Excluir órdenes inactivas
      },
    },
    orderBy: {
      fecha_asignacion: "desc",
    },
    include: {
      orden_trabajo_usuario: {
        include: {
          usuario: true, // Solo se incluye la relación usuario
        },
      },
      orden_trabajo_sistemas: {
        include: {
          sistema: true,
          embarcacion_sistema: true,
          orden_trabajo_parte: {
            include: {
              parte: true,
            },
          },
        },
      },
    },
  });

  if (ordenesTrabajo.length === 0) {
    throw new Error("No hay órdenes de trabajo activas.");
  }

  return ordenesTrabajo;
};

/**
 * Obtener una Orden de Trabajo Activa por su ID
 * @param {number} id_orden_trabajo - ID de la orden de trabajo
 * @returns {Promise<Object|null>} - Orden de trabajo si está activa, `null` si no existe o está inactiva
 * @throws {Error} - Si el ID no es válido
 */
export const getOrdenTrabajoById = async (id_orden_trabajo) => {
  if (isNaN(id_orden_trabajo)) {
    throw new Error("El ID de la orden de trabajo debe ser un número válido.");
  }

  const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
    where: {
      id_orden_trabajo: parseInt(id_orden_trabajo, 10),
      estado: {
        not: "inactivo", // Filtra solo órdenes activas
      },
    },
    include: {
      orden_trabajo_usuario: {
        include: {
          usuario: true, // Solo se incluye la relación usuario
        },
      },
      orden_trabajo_sistemas: {
        include: {
          sistema: true,
          embarcacion_sistema: true,
          orden_trabajo_parte: {
            include: {
              parte: true,
            },
          },
        },
      },
    },
  });

  if (!ordenTrabajo) {
    throw new Error(
      `La orden de trabajo con ID ${id_orden_trabajo} no existe o está inactiva.`
    );
  }

  return ordenTrabajo;
};

/**
 * 🔹 Actualizar una Orden de Trabajo
 * @param {number} id_orden_trabajo - ID de la orden de trabajo a actualizar
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} - Orden de trabajo actualizada
 */
export const actualizarOrdenTrabajo = async (id_orden_trabajo, data) => {
  if (isNaN(id_orden_trabajo)) {
    throw new Error("El ID de la orden de trabajo debe ser un número válido.");
  }

  const ordenExistente = await prisma.ordenTrabajo.findUnique({
    where: { id_orden_trabajo },
  });

  if (!ordenExistente || ordenExistente.estado === "inactivo") {
    throw new Error(
      `La orden de trabajo con ID ${id_orden_trabajo} no existe o está inactiva.`
    );
  }

  const fecha_actualizacion = getUTCTime(new Date().toISOString());

  const ordenActualizada = await prisma.ordenTrabajo.update({
    where: { id_orden_trabajo },
    data: {
      ...data,
      actualizado_en: fecha_actualizacion,
    },
  });

  return ordenActualizada;
};

/**
 * 🔹 Desactivar (Inactivar) una Orden de Trabajo
 * @param {number} id_orden_trabajo - ID de la orden de trabajo a inactivar
 * @returns {Promise<Object>} - Orden de trabajo desactivada
 */
export const desactivarOrdenTrabajo = async (id_orden_trabajo) => {
  if (isNaN(id_orden_trabajo)) {
    throw new Error("El ID de la orden de trabajo debe ser un número válido.");
  }

  const ordenExistente = await prisma.ordenTrabajo.findUnique({
    where: { id_orden_trabajo },
  });

  if (!ordenExistente) {
    throw new Error(
      `La orden de trabajo con ID ${id_orden_trabajo} no existe.`
    );
  }

  if (ordenExistente.estado === "inactivo") {
    throw new Error(
      `La orden de trabajo con ID ${id_orden_trabajo} ya está inactiva.`
    );
  }

  const fecha_actualizacion = getUTCTime(new Date().toISOString());

  const ordenDesactivada = await prisma.ordenTrabajo.update({
    where: { id_orden_trabajo },
    data: {
      estado: "inactivo",
      actualizado_en: fecha_actualizacion,
    },
  });

  return ordenDesactivada;
};
