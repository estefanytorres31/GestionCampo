import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * 🔹 Asignar un Trabajo a una Embarcación (Crear o Reactivar Orden de Trabajo)
 */
export const asignarTrabajoAEmbarcacion = async (data) => {
  const {
    id_tipo_trabajo,
    id_embarcacion,
    id_puerto,
    id_jefe_asigna,
    codigo,
    comentarios = null,
    motorista = null,
    supervisor = null,
  } = data;

  if (!id_tipo_trabajo || !id_embarcacion || !id_puerto || !id_jefe_asigna || !codigo) {
    throw new Error("Los campos obligatorios deben estar completos.");
  }

  // Validación de claves foráneas
  const [tipoTrabajo, embarcacion, puerto, jefeAsigna] = await Promise.all([
    prisma.tipoTrabajo.findUnique({ where: { id_tipo_trabajo } }),
    prisma.embarcacion.findUnique({ where: { id_embarcacion } }),
    prisma.puerto.findUnique({ where: { id_puerto } }),
    prisma.usuario.findUnique({ where: { id: id_jefe_asigna } }),
  ]);

  if (!tipoTrabajo) throw new Error(`No se encontró el Tipo de Trabajo con ID ${id_tipo_trabajo}.`);
  if (!embarcacion) throw new Error(`No se encontró la Embarcación con ID ${id_embarcacion}.`);
  if (!puerto) throw new Error(`No se encontró el Puerto con ID ${id_puerto}.`);
  if (!jefeAsigna) throw new Error(`No se encontró el Usuario Jefe con ID ${id_jefe_asigna}.`);

  const fechaActual = getUTCTime(new Date().toISOString());

  return await prisma.$transaction(async (prisma) => {
    let ordenTrabajo;
    let mensaje;

    ordenTrabajo = await prisma.ordenTrabajo.findUnique({ where: { codigo } });

    if (ordenTrabajo) {
      if (ordenTrabajo.estado === "inactivo") {
        ordenTrabajo = await prisma.ordenTrabajo.update({
          where: { codigo },
          data: {
            estado: "pendiente",
            comentarios: comentarios || ordenTrabajo.comentarios,
            motorista: motorista || ordenTrabajo.motorista,
            supervisor: supervisor || ordenTrabajo.supervisor,
            fecha_asignacion: fechaActual,
            actualizado_en: fechaActual,
          },
        });
        mensaje = "Orden de trabajo reactivada exitosamente.";
      } else {
        throw new Error(`Una orden con el código "${codigo}" ya existe y está activa.`);
      }
    } else {
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
          fecha_asignacion: fechaActual,
          estado: "pendiente",
          creado_en: fechaActual,
          actualizado_en: fechaActual,
        },
      });
      mensaje = "Trabajo asignado a la embarcación exitosamente.";
    }

    return { mensaje, ordenTrabajo };
  });
};

/**
 * 🔹 Actualizar una Orden de Trabajo
 */
export const actualizarOrdenTrabajo = async (id_orden_trabajo, data) => {
  if (isNaN(id_orden_trabajo)) {
    throw new Error("El ID de la orden de trabajo debe ser un número válido.");
  }

  const ordenExistente = await prisma.ordenTrabajo.findUnique({
    where: { id_orden_trabajo },
  });

  if (!ordenExistente || ordenExistente.estado === "inactivo") {
    throw new Error(`La orden con ID ${id_orden_trabajo} no existe o está inactiva.`);
  }

  const fechaActualizacion = getUTCTime(new Date().toISOString());

  return await prisma.ordenTrabajo.update({
    where: { id_orden_trabajo },
    data: {
      ...data,
      actualizado_en: fechaActualizacion,
    },
  });
};

export const getAllOrdenesTrabajo = async (query) => {
  const { id_tipo_trabajo, id_embarcacion, id_puerto, id_jefe_asigna, codigo } = query;

  // Construcción del objeto where dinámico
  const whereClause = {
      estado: { not: "inactivo" }, // Solo traer órdenes activas
      ...(id_tipo_trabajo && { id_tipo_trabajo: parseInt(id_tipo_trabajo) }),
      ...(id_embarcacion && { id_embarcacion: parseInt(id_embarcacion) }),
      ...(id_puerto && { id_puerto: parseInt(id_puerto) }),
      ...(id_jefe_asigna && { id_jefe_asigna: parseInt(id_jefe_asigna) }),
      ...(codigo && { codigo }),
  };

  // Obtener las órdenes filtradas
  return await prisma.ordenTrabajo.findMany({
      where: whereClause,
      orderBy: { fecha_asignacion: "desc" },
  });
};

/**
 * Obtener una Orden de Trabajo por ID
 */
export const getOrdenTrabajoById = async (id_orden_trabajo) => {
  if (isNaN(id_orden_trabajo)) {
    throw new Error("El ID de la orden de trabajo debe ser un número válido.");
  }

  const ordenTrabajo = await prisma.ordenTrabajo.findFirst({
    where: { id_orden_trabajo: parseInt(id_orden_trabajo, 10), estado: { not: "inactivo" } },
  });

  if (!ordenTrabajo) {
    throw new Error(`La orden con ID ${id_orden_trabajo} no existe o está inactiva.`);
  }

  return ordenTrabajo;
};

/**
 * 🔹 Desactivar una Orden de Trabajo
 */
export const desactivarOrdenTrabajo = async (id_orden_trabajo) => {
  if (isNaN(id_orden_trabajo)) {
    throw new Error("El ID de la orden de trabajo debe ser un número válido.");
  }

  const ordenExistente = await prisma.ordenTrabajo.findUnique({ where: { id_orden_trabajo } });

  if (!ordenExistente) {
    throw new Error(`La orden con ID ${id_orden_trabajo} no existe.`);
  }

  if (ordenExistente.estado === "inactivo") {
    throw new Error(`La orden con ID ${id_orden_trabajo} ya está inactiva.`);
  }

  return await prisma.ordenTrabajo.update({
    where: { id_orden_trabajo },
    data: { estado: "inactivo" },
  });
};
