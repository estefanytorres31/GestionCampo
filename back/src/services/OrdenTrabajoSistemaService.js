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
    id_embarcacion_sistema, // Ahora se espera este campo
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

  // Verificar que la embarcación de la OrdenTrabajo coincida con la del EmbarcacionSistema
  if (
    ordenTrabajo.id_embarcacion !==
    embarcacionSistema.embarcacion.id_embarcacion
  ) {
    throw new Error(
      "La embarcación asociada al EmbarcacionSistema no coincide con la de la Orden de Trabajo."
    );
  }

  // Verificar si ya existe la orden con la combinación de id_orden_trabajo e id_embarcacion_sistema
  const existente = await prisma.ordenTrabajoSistema.findFirst({
    where: {
      id_orden_trabajo,
      id_embarcacion_sistema,
    },
  });

  if (existente) {
    if (existente.estado !== "inactivo") {
      throw new Error(
        "Ya existe una orden de trabajo para este EmbarcacionSistema."
      );
    } else {
      // Reactivar si estaba inactivo: se actualiza además id_abordaje a null por defecto
      const ordenReactivada = await prisma.ordenTrabajoSistema.update({
        where: { id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema },
        data: {
          estado: "pendiente",
          actualizado_en: fechaActual,
          materiales: materiales || existente.materiales,
          proximo_abordaje: proximo_abordaje || existente.proximo_abordaje,
          observaciones: observaciones || existente.observaciones,
          id_abordaje: null, // Se establece por defecto en null
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

      // Reactivar o crear detalles si existen
      if (fallas || causas || solucion || pendiente) {
        await prisma.ordenTrabajoSistemaDetalle.upsert({
          where: {
            id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
          },
          update: {
            fallas: fallas || existente.detalle?.fallas,
            causas: causas || existente.detalle?.causas,
            solucion: solucion || existente.detalle?.solucion,
            pendiente: pendiente || existente.detalle?.pendiente,
            actualizado_en: fechaActual,
          },
          create: {
            id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
            fallas,
            causas,
            solucion,
            pendiente,
            creado_en: fechaActual,
          },
        });
      }

      // Manejar fotos si son provistas
      if (fotos && fotos.length > 0) {
        await prisma.ordenTrabajoSistemaFoto.createMany({
          data: fotos.map((url) => ({
            id_orden_trabajo_sistema: existente.id_orden_trabajo_sistema,
            url,
            creado_en: fechaActual,
          })),
        });
      }

      return ordenReactivada;
    }
  }

  // Crear nueva orden de trabajo, estableciendo id_abordaje en null por defecto
  const nuevaOrdenTrabajoSistema = await prisma.ordenTrabajoSistema.create({
    data: {
      id_orden_trabajo,
      id_embarcacion_sistema, // Usamos la nueva FK
      id_abordaje: null, // Se asigna null por defecto
      estado: "pendiente",
      avance: 0,
      materiales,
      proximo_abordaje,
      observaciones,
      creado_en: fechaActual,
      actualizado_en: fechaActual,
      // Crear detalles si aplica
      detalle:
        fallas || causas || solucion || pendiente
          ? {
              create: {
                fallas,
                causas,
                solucion,
                pendiente,
                creado_en: fechaActual,
              },
            }
          : undefined,
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

  // Si hay fotos, asociarlas
  if (fotos && fotos.length > 0) {
    await prisma.ordenTrabajoSistemaFoto.createMany({
      data: fotos.map((url) => ({
        id_orden_trabajo_sistema:
          nuevaOrdenTrabajoSistema.id_orden_trabajo_sistema,
        url,
        creado_en: fechaActual,
      })),
    });
  }

  return nuevaOrdenTrabajoSistema;
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
    id_abordaje
  } = data;

  const fechaActualizacion = getUTCTime(new Date().toISOString());

  // Iniciar una transacción para asegurar la integridad de los datos
  return await prisma.$transaction(async (prisma) => {
    // 1. Primero obtenemos las fotos actuales para eliminarlas de Cloudinary
    const fotosActuales = await prisma.ordenTrabajoSistemaFoto.findMany({
      where: { id_orden_trabajo_sistema: parseInt(id) }
    });

    // 2. Eliminar las fotos existentes de Cloudinary y la base de datos
    if (fotosActuales.length > 0) {
      // Eliminar de Cloudinary
      for (const foto of fotosActuales) {
        try {
          await deleteImage(foto.url);
        } catch (error) {
          console.error("Error eliminando imagen de Cloudinary:", error);
          // Continuamos aunque falle la eliminación en Cloudinary
        }
      }

      // Eliminar registros de la base de datos
      await prisma.ordenTrabajoSistemaFoto.deleteMany({
        where: { id_orden_trabajo_sistema: parseInt(id) }
      });
    }

    // 3. Actualizar los datos básicos de la orden
    const updateData = {
      ...(avance !== undefined && { avance: parseInt(avance) }), 
      ...(materiales !== undefined && { materiales }),
      ...(proximo_abordaje !== undefined && { proximo_abordaje }),
      ...(observaciones !== undefined && { observaciones }),
      actualizado_en: fechaActualizacion,
    };

    // 3.1. Validar y actualizar id_abordaje si se proporciona
    if (id_abordaje !== undefined) {
      if (id_abordaje !== null) {
        const parsedAbordajeId = parseInt(id_abordaje, 10);
        if (isNaN(parsedAbordajeId)) {
          throw new Error("El id_abordaje debe ser un número válido o null.");
        }
        // Validar que el Abordaje exista y esté activo
        const abordajeExistente = await prisma.abordaje.findFirst({
          where: { id: parsedAbordajeId, estado: true },
        });
        if (!abordajeExistente) {
          throw new Error(`No se encontró un Abordaje activo con id ${parsedAbordajeId}.`);
        }
        updateData.id_abordaje = parsedAbordajeId;
      } else {
        updateData.id_abordaje = null;
      }
    }

    // 4. Actualizar la orden
    let ordenActualizada = await prisma.ordenTrabajoSistema.update({
      where: { id_orden_trabajo_sistema: parseInt(id) },
      data: updateData,
    });

    // 5. Actualizar o crear detalle si aplica
    if (fallas || causas || solucion || pendiente) {
      await prisma.ordenTrabajoSistemaDetalle.upsert({
        where: { id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema },
        update: {
          ...(fallas !== undefined && { fallas }),
          ...(causas !== undefined && { causas }),
          ...(solucion !== undefined && { solucion }),
          ...(pendiente !== undefined && { pendiente }),
          actualizado_en: fechaActualizacion,
        },
        create: {
          id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema,
          fallas: fallas || null,
          causas: causas || null,
          solucion: solucion || null,
          pendiente: pendiente || null,
          creado_en: fechaActualizacion,
        }
      });
    }

    // 6. Agregar las nuevas fotos si existen
    if (fotos && fotos.length > 0) {
      await prisma.ordenTrabajoSistemaFoto.createMany({
        data: fotos.map((url) => ({
          id_orden_trabajo_sistema: ordenActualizada.id_orden_trabajo_sistema,
          url,
          creado_en: fechaActualizacion,
        })),
      });
    }

    // 7. Obtener la orden actualizada con todas las relaciones y las nuevas fotos
    ordenActualizada = await prisma.ordenTrabajoSistema.findUnique({
      where: { id_orden_trabajo_sistema: parseInt(id) },
      include: { 
        fotos: true,
        detalle: true,
        embarcacion_sistema: {
          include: {
            sistema: true,
            embarcacion: true
          }
        },
        orden_trabajo: {
          include: {
            tipo_trabajo: true,
            embarcacion: true,
            puerto: true,
            jefe_asigna: true
          }
        }
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
