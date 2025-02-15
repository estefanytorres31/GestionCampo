import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";
import { deleteImage } from "../utils/Cloudinary.js";

const prisma = new PrismaClient();

/**
 * Crear o reactivar una OrdenTrabajoSistema usando id_embarcacion_sistema
 */
export const createOrdenTrabajoSistema = async (data) => {
  const {
    id_orden_trabajo,
    id_embarcacion_sistema,
    id_abordaje,
    materiales,
    proximo_abordaje,
    fallas,
    causas,
    solucion,
    pendiente,
    fotos,
    observaciones,
  } = data;

  // Validar campos obligatorios
  if (!id_orden_trabajo || !id_embarcacion_sistema) {
    throw new Error(
      "Los campos 'id_orden_trabajo' e 'id_embarcacion_sistema' son obligatorios."
    );
  }

  const fechaActual = getUTCTime(new Date().toISOString());

  // Verificar que la OrdenTrabajo exista y obtener su embarcación
  const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
    where: { id_orden_trabajo },
    select: { id_embarcacion: true },
  });

  if (!ordenTrabajo) {
    throw new Error(
      `No se encontró la Orden de Trabajo con ID ${id_orden_trabajo}.`
    );
  }

  // Verificar que el EmbarcacionSistema exista y obtener su embarcación asociada
  const embarcacionSistema = await prisma.embarcacionSistema.findUnique({
    where: { id_embarcacion_sistema },
    include: {
      embarcacion: true,
      sistema: true,
    },
  });

  if (!embarcacionSistema) {
    throw new Error(
      `No se encontró EmbarcacionSistema con ID ${id_embarcacion_sistema}.`
    );
  }

  // Verificar el abordaje si se proporciona
  if (id_abordaje) {
    const abordaje = await prisma.abordaje.findUnique({
      where: { id: parseInt(id_abordaje) },
    });
    if (!abordaje) {
      throw new Error(`No se encontró el Abordaje con ID ${id_abordaje}.`);
    }
  }

  // Verificar que la embarcación de la OrdenTrabajo coincida con la del EmbarcacionSistema
  if (ordenTrabajo.id_embarcacion !== embarcacionSistema.embarcacion.id_embarcacion) {
    throw new Error(
      "La embarcación asociada al EmbarcacionSistema no coincide con la de la Orden de Trabajo."
    );
  }

  return await prisma.$transaction(async (prisma) => {
    // Verificar si ya existe la orden
    const existente = await prisma.ordenTrabajoSistema.findFirst({
      where: {
        id_orden_trabajo,
        id_embarcacion_sistema,
      },
      include: {
        detalle: true,
      },
    });

    if (existente) {
      if (existente.estado !== "inactivo") {
        throw new Error(
          "Ya existe una orden de trabajo activa para este EmbarcacionSistema."
        );
      }

      // Reactivar orden existente
      const ordenReactivada = await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema },
        data: {
          estado: "pendiente",
          actualizado_en: fechaActual,
        },
        include: {
          fotos: true,
          detalle: true,
          embarcacion_sistema: {
            include: {
              sistema: true,
              embarcacion: true,
            },
          },
          orden_trabajo: true,
        },
      });

      // Actualizar o crear detalles
      if (existente.detalle) {
        await prisma.ordenTrabajoSistemaDetalle.update({
          where: {
            id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
          },
          data: {
            id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
            observaciones: observaciones || existente.detalle.observaciones,
            materiales: materiales || existente.detalle.materiales,
            proximo_abordaje: proximo_abordaje || existente.detalle.proximo_abordaje,
            fallas: fallas || existente.detalle.fallas,
            causas: causas || existente.detalle.causas,
            solucion: solucion || existente.detalle.solucion,
            pendiente: pendiente || existente.detalle.pendiente,
          },
        });
      } else {
        await prisma.ordenTrabajoSistemaDetalle.create({
          data: {
            id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
            id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
            observaciones,
            materiales,
            proximo_abordaje,
            fallas,
            causas,
            solucion,
            pendiente,
          },
        });
      }

      // Manejar fotos
      if (fotos?.length > 0) {
        await prisma.ordenTrabajoSistemaFoto.createMany({
          data: fotos.map((url) => ({
            id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
            id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
            url,
            creado_en: fechaActual,
          })),
        });
      }

      return ordenReactivada;
    }

    // Crear nueva orden de trabajo
    const nuevaOrden = await prisma.ordenTrabajoSistema.create({
      data: {
        id_orden_trabajo,
        id_embarcacion_sistema,
        estado: "pendiente",
        detalle: {
          create: {
            id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
            observaciones,
            materiales,
            proximo_abordaje,
            fallas,
            causas,
            solucion,
            pendiente,
            avance: 0,
          },
        },
      },
      include: {
        fotos: true,
        detalle: true,
        embarcacion_sistema: {
          include: {
            sistema: true,
            embarcacion: true,
          },
        },
        orden_trabajo: true,
      },
    });

    // Crear fotos si existen
    if (fotos?.length > 0) {
      await prisma.ordenTrabajoSistemaFoto.createMany({
        data: fotos.map((url) => ({
          id_orden_trabajo_sistema: nuevaOrden.id_orden_trabajo_sistema,
          id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
          url,
          creado_en: fechaActual,
        })),
      });
    }

    return nuevaOrden;
  });
};
/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajoSistema = async () => {
  const ordenes = await prisma.ordenTrabajoSistema.findMany({
    where: { estado: { not: "inactivo" } },
    include: {
      fotos: true,
      detalle: true,
      // Ahora se incluye la relación a embarcacion_sistema en lugar de tipo_trabajo_embarcacion_sistema_parte
      embarcacion_sistema: {
        include: {
          sistema: true,
          embarcacion: true,
        },
      },
      orden_trabajo: {
        include: {
          tipo_trabajo: true,
          embarcacion: true,
          puerto: true,
          jefe_asigna: true,
        },
      },
    },
    orderBy: { creado_en: "desc" },
  });

  if (ordenes.length === 0) {
    throw new Error("No hay órdenes de trabajo disponibles.");
  }

  return ordenes;
};

/**
 * Obtener los sistemas y partes asociados a una Orden de Trabajo
 */
export const getSistemasYPartesPorOrdenTrabajo = async (id_orden_trabajo) => {
  if (!id_orden_trabajo) {
    throw new Error("El ID de la orden de trabajo es obligatorio.");
  }

  const sistemas = await prisma.ordenTrabajoSistema.findMany({
    where: { id_orden_trabajo: parseInt(id_orden_trabajo) },
    include: {
      // Ahora se incluye la relación a embarcacion_sistema
      embarcacion_sistema: {
        include: {
          sistema: true,
          embarcacion: true,
        },
      },
      orden_trabajo_parte: {
        include: {
          parte: true,
        },
      },
    },
    orderBy: { creado_en: "desc" },
  });

  if (sistemas.length === 0) {
    throw new Error(
      `No se encontraron sistemas para la orden de trabajo con ID ${id_orden_trabajo}.`
    );
  }

  // Transformar los datos para devolver solo lo necesario
  const resultado = sistemas.map((sistema) => ({
    id_orden_trabajo_sistema: sistema.id_orden_trabajo_sistema,
    estado_sistema: sistema.estado,
    comentario_sistema: sistema.observaciones || null,
    sistema: sistema.embarcacion_sistema.sistema,
    partes: sistema.orden_trabajo_parte.map((parte) => ({
      id_orden_trabajo_parte: parte.id_orden_trabajo_parte,
      estado_parte: parte.estado,
      comentario_parte: parte.comentario || null,
      parte: parte.parte,
    })),
  }));

  return resultado;
};

/**
 * Obtener una OrdenTrabajoSistema por ID
 */
export const getOrdenTrabajoSistemaById = async (id) => {
  const orden = await prisma.ordenTrabajoSistema.findUnique({
    where: { id_orden_trabajo_sistema: parseInt(id) },
    include: {
      fotos: true,
      detalle: true,
      embarcacion_sistema: {
        include: {
          sistema: true,
          embarcacion: true,
        },
      },
      orden_trabajo: {
        include: {
          tipo_trabajo: true,
          embarcacion: true,
          puerto: true,
          jefe_asigna: true,
        },
      },
    },
  });

  if (!orden || orden.estado === "inactivo") {
    throw new Error(
      `La orden de trabajo con ID ${id} no existe o está inactiva.`
    );
  }

  return orden;
};

/**
 * Actualizar una OrdenTrabajoSistema
 */
export const updateOrdenTrabajoSistema = async (id, data) => {
  const {
    avance,
    materiales,
    proximo_abordaje,
    fallas,
    causas,
    solucion,
    pendiente,
    fotos,
    observaciones,
    id_abordaje,
  } = data;

  const fechaActual = getUTCTime(new Date().toISOString());

  return await prisma.$transaction(async (prisma) => {
    // Validar que la orden exista
    const ordenExistente = await prisma.ordenTrabajoSistema.findUnique({
      where: { id_orden_trabajo_sistema: parseInt(id) },
      include: { fotos: true },
    });

    if (!ordenExistente) {
      throw new Error(`No se encontró la orden con ID ${id}`);
    }

    // Validar id_abordaje si se proporciona
    if (id_abordaje !== undefined) {
      if (id_abordaje !== null) {
        const abordaje = await prisma.abordaje.findUnique({
          where: { id: parseInt(id_abordaje) },
        });
        if (!abordaje) {
          throw new Error(`No se encontró el Abordaje con ID ${id_abordaje}`);
        }
      }
    }

        // Crear nuevas fotos si existen
        if (fotos?.length > 0) {
          await prisma.ordenTrabajoSistemaFoto.createMany({
            data: fotos.map((url) => ({
              id_orden_trabajo_sistema: parseInt(id),
              id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
              url,
              creado_en: fechaActual,
            })),
          });
        }


    // Actualizar orden y detalles
    const ordenActualizada = await prisma.ordenTrabajoSistema.update({
      where: { id_orden_trabajo_sistema: parseInt(id) },
      data: {
        actualizado_en: fechaActual,
        detalle: {
          upsert: {
            create: {
              id_abordaje: id_abordaje ? parseInt(id_abordaje) : null,
              observaciones,
              avance: avance !== undefined ? parseInt(avance) : 0,
              materiales,
              proximo_abordaje,
              fallas,
              causas,
              solucion,
              pendiente,
            },
            update: {
              id_abordaje: id_abordaje !== undefined ? (id_abordaje ? parseInt(id_abordaje) : null) : undefined,
              ...(observaciones !== undefined && { observaciones }),
              ...(avance !== undefined && { avance: parseInt(avance) }),
              ...(materiales !== undefined && { materiales }),
              ...(proximo_abordaje !== undefined && { proximo_abordaje }),
              ...(fallas !== undefined && { fallas }),
              ...(causas !== undefined && { causas }),
              ...(solucion !== undefined && { solucion }),
              ...(pendiente !== undefined && { pendiente }),
            },
          },
        },
      },
      include: {
        fotos: true,
        detalle: true,
        embarcacion_sistema: {
          include: {
            sistema: true,
            embarcacion: true,
          },
        },
        orden_trabajo: {
          include: {
            tipo_trabajo: true,
            embarcacion: true,
            puerto: true,
            jefe_asigna: true,
          },
        },
      },
    });


    return ordenActualizada;
  });
};


/**
 * Desactivar una OrdenTrabajoSistema
 */
export const deleteOrdenTrabajoSistema = async (id) => {
  const orden = await prisma.ordenTrabajoSistema.findUnique({
    where: { id_orden_trabajo_sistema: parseInt(id) },
  });

  if (!orden || orden.estado === "inactivo") {
    throw new Error(`La orden con ID ${id} no existe o ya está inactiva.`);
  }

  return await prisma.ordenTrabajoSistema.update({
    where: { id_orden_trabajo_sistema: parseInt(id) },
    data: { estado: "inactivo" },
  });
};

/**
 * Actualizar el estado de una OrdenTrabajoSistema
 */
export const updateEstadoOrdenTrabajoSistema = async (id, nuevoEstado) => {
  if (!id || !nuevoEstado) {
    throw new Error("El ID y el nuevo estado son obligatorios.");
  }

  const orden = await prisma.ordenTrabajoSistema.findUnique({
    where: { id_orden_trabajo_sistema: parseInt(id) },
  });

  if (!orden) {
    throw new Error(`No se encontró la Orden de Trabajo con ID ${id}.`);
  }

  const fechaActual = getUTCTime(new Date().toISOString());

  const ordenActualizada = await prisma.ordenTrabajoSistema.update({
    where: { id_orden_trabajo_sistema: parseInt(id) },
    data: {
      estado: nuevoEstado,
      actualizado_en: fechaActual,
    },
  });

  return ordenActualizada;
};
