import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crear una Asistencia (Entrada o Salida)
 * @param {Object} params
 * @param {number} params.id_usuario
 * @param {number} params.id_embarcacion
 * @param {TipoAsistencia} params.tipo - 'entrada' o 'salida'
 * @param {Decimal} [params.latitud]
 * @param {Decimal} [params.longitud]
 * @param {number} [params.id_orden_trabajo]
 * @returns {Promise<Object>} Asistencia creada
 */
export const crearAsistencia = async ({
    id_usuario,
    id_embarcacion,
    tipo,
    latitud,
    longitud,
    id_orden_trabajo,
}) => {
    const fechaActual = getUTCTime(new Date().toISOString());

    // Validaciones básicas
    if (isNaN(id_usuario) || isNaN(id_embarcacion)) {
        throw new Error("Los IDs de usuario y embarcación deben ser válidos.");
    }

    if (!["entrada", "salida"].includes(tipo)) {
        throw new Error("El tipo de asistencia debe ser 'entrada' o 'salida'.");
    }

    // Verificar que el Usuario exista y esté activo
    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id_usuario) },
    });

    if (!usuario || !usuario.estado) {
        throw new Error(`El usuario con ID ${id_usuario} no existe o está inactivo.`);
    }

    // Verificar que la Embarcación exista y esté activa
    const embarcacion = await prisma.embarcacion.findUnique({
        where: { id_embarcacion: parseInt(id_embarcacion)},
    });

    if (!embarcacion || !embarcacion.estado) {
        throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
    }

    // Opcional: Verificar que la Orden de Trabajo exista si se proporciona
    if (id_orden_trabajo) {
        const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
            where: { id_orden_trabajo: parseInt(id_orden_trabajo) },
        });

        if (!ordenTrabajo) {
            throw new Error(`La orden de trabajo con ID ${id_orden_trabajo} no existe.`);
        }
    }


    if (tipo === "salida") {
      // Obtener la última asistencia del usuario
      const ultimaAsistencia = await prisma.asistencia.findFirst({
          where: {
              id_usuario: parseInt(id_usuario),
          },
          orderBy: { fecha_hora: "desc" },
      });
  
      if (!ultimaAsistencia) {
          throw new Error("No se puede registrar una salida sin una entrada previa.");
      }
  
      if (ultimaAsistencia.tipo !== "entrada") {
          throw new Error("La última asistencia registrada no es una entrada. No se puede registrar una salida.");
      }
  
      // 🔹 Verificar que la entrada y la salida sean para la misma embarcación
      if (ultimaAsistencia.id_embarcacion !== id_embarcacion) {
          throw new Error("Debe registrar la salida en la misma embarcación en la que registró la entrada.");
      }
  
      // Verificar si ya existe una salida después de la última entrada
      const asistenciaConSalida = await prisma.asistencia.findFirst({
          where: {
              id_usuario: parseInt(id_usuario),
              tipo: "salida",
              fecha_hora: {
                  gt: ultimaAsistencia.fecha_hora,
              },
          },
          orderBy: { fecha_hora: "desc" },
      });
  
      if (asistenciaConSalida) {
          throw new Error("Ya existe una salida registrada después de la última entrada.");
      }
  }
  

    // Crear la Asistencia
    const asistencia = await prisma.asistencia.create({
        data: {
            id_usuario,
            id_embarcacion,
            tipo,
            latitud,
            longitud,
            id_orden_trabajo,
            fecha_hora: fechaActual,
            creado_en: fechaActual
        },
    });

    return asistencia;
};

/**
 * Obtener asistencias con cálculos de entrada y salida sin usar la vista,
 * y agregando el puerto actual (último registro de historialPuertos) de la embarcación.
 */
export const getAsistencias = async (filters, page = 1, pageSize = 10) => {
    const { nombre_completo, fecha, nombre_embarcacion } = filters;
  
    // Construcción dinámica de filtros: se inicia filtrando solo registros de "entrada"
    const whereClause = { tipo: "entrada" };
  
    if (nombre_completo) {
      whereClause.usuario = {
        nombre_completo: { contains: nombre_completo },
      };
    }
  
    if (fecha) {
      whereClause.fecha_hora = {
        gte: new Date(`${fecha}T00:00:00.000Z`),
        lt: new Date(`${fecha}T23:59:59.999Z`),
      };
    }
  
    if (nombre_embarcacion) {
      whereClause.embarcacion = {
        nombre: { contains: nombre_embarcacion },
      };
    }
  
    const skip = (page - 1) * pageSize; // Calcular cuántos registros omitir
  
    const [asistencias, total] = await Promise.all([
      prisma.asistencia.findMany({
        where: whereClause,
        include: {
          usuario: { select: { nombre_completo: true } },
          // Se incluye también el id de la embarcación para usarlo en la búsqueda del historial
          embarcacion: { select: { id_embarcacion: true, nombre: true } },
        },
        orderBy: { fecha_hora: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.asistencia.count({ where: whereClause }), // Obtener total de registros filtrados
    ]);
  
    // Por cada entrada, se busca la salida correspondiente, se calculan las horas trabajadas
    // y se busca el último historial (para obtener el puerto actual y su nombre)
    const asistenciasConSalidas = await Promise.all(
      asistencias.map(async (entrada) => {
        // Buscar la salida correspondiente a la entrada
        const salida = await prisma.asistencia.findFirst({
          where: {
            id_usuario: entrada.id_usuario,
            id_embarcacion: entrada.id_embarcacion,
            tipo: "salida",
            fecha_hora: { gte: entrada.fecha_hora }, // Buscar la salida posterior a la entrada
          },
          orderBy: { fecha_hora: "asc" },
        });
  
        // Cálculo de las horas trabajadas
        let horas_trabajo = null;
        if (salida) {
          const diffMs = new Date(salida.fecha_hora) - new Date(entrada.fecha_hora);
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          const seconds = Math.floor((diffMs % 60000) / 1000);
          horas_trabajo = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
  
        // Buscar el último historial de puerto para la embarcación
        const ultimoHistorial = await prisma.historialPuerto.findFirst({
          where: {
            embarcacion_id: entrada.embarcacion.id_embarcacion,
          },
          orderBy: { fecha_llegada: "desc" },
          include: {
            puerto: { select: { nombre: true } },
          },
        });
  
        return {
          id: entrada.id_asistencia,
          nombre_completo: entrada.usuario.nombre_completo,
          fecha: entrada.fecha_hora.toISOString().split("T")[0],
          fecha_hora_entrada: entrada.fecha_hora,
          fecha_hora_salida: salida ? salida.fecha_hora : null,
          // Coordenadas de la entrada y, en caso de existir, de la salida
          coordenadas_entrada: {
            latitud: entrada.latitud,
            longitud: entrada.longitud,
          },
          coordenadas_salida: salida
            ? {
                latitud: salida.latitud,
                longitud: salida.longitud,
              }
            : null,
          embarcacion: entrada.embarcacion.nombre,
          horas_trabajo,
          // Se agrega el nombre del puerto actual obtenido del último historial
          puerto_actual: ultimoHistorial ? ultimoHistorial.puerto.nombre : null,
        };
      })
    );
  
    return {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: asistenciasConSalidas,
    };
  };
  

/**
 * 🔹 Obtener Asistencias con Filtros Opcionales (Usuario, Embarcación, OrdenTrabajo)
 * @param {Object} query - Parámetros de búsqueda
 * @returns {Promise<Array>} Lista de asistencias
 */
export const obtenerAsistencias = async (query) => {
    const { id_usuario, id_embarcacion, id_orden_trabajo } = query;

    // Construcción del objeto where dinámico
    const whereClause = {
        ...(id_usuario && { id_usuario: parseInt(id_usuario) }),
        ...(id_embarcacion && { id_embarcacion: parseInt(id_embarcacion) }),
        ...(id_orden_trabajo && { id_orden_trabajo: parseInt(id_orden_trabajo) }),
    };

    const asistencias = await prisma.asistencia.findMany({
        where: whereClause,
        include: {
            usuario: true,
            embarcacion: true,
            orden_trabajo: true,
        },
        orderBy: { fecha_hora: "desc" },
    });

    if (asistencias.length === 0) {
        throw new Error("No se encontraron asistencias con los criterios especificados.");
    }

    return asistencias;
};

/**
 * 🔹 Obtener una Asistencia por su ID
 * @param {number} id_asistencia - ID de la asistencia
 * @returns {Promise<Object>} Asistencia encontrada
 */
export const obtenerAsistenciaPorId = async (id_asistencia) => {
    if (isNaN(id_asistencia)) {
        throw new Error("El ID de asistencia debe ser un número válido.");
    }

    const asistencia = await prisma.asistencia.findUnique({
        where: { id_asistencia: parseInt(id_asistencia) },
        include: {
            usuario: true,
            embarcacion: true,
            orden_trabajo: true,
        },
    });

    if (!asistencia) {
        throw new Error(`No se encontró la asistencia con ID ${id_asistencia}.`);
    }

    return asistencia;
};

/**
 * Actualizar una Asistencia
 * @param {number} id_asistencia
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Asistencia actualizada
 */
export const actualizarAsistencia = async (id_asistencia, data) => {
    const fechaActual = getUTCTime(new Date().toISOString());

    if (isNaN(id_asistencia)) {
        throw new Error("El ID de asistencia debe ser válido.");
    }

    // Verificar que la Asistencia exista
    const asistenciaExistente = await prisma.asistencia.findUnique({
        where: { id_asistencia },
    });

    if (!asistenciaExistente) {
        throw new Error(`La asistencia con ID ${id_asistencia} no existe.`);
    }

    // Actualizar la Asistencia
    const asistenciaActualizada = await prisma.asistencia.update({
        where: { id_asistencia },
        data: {
            ...data,
            actualizado_en: fechaActual,
        },
    });

    return asistenciaActualizada;
};

/**
 * Eliminar una Asistencia
 * @param {number} id_asistencia
 * @returns {Promise<Object>} Asistencia eliminada
 */
export const eliminarAsistencia = async (id_asistencia) => {
    if (isNaN(id_asistencia)) {
        throw new Error("El ID de asistencia debe ser válido.");
    }

    // Verificar que la Asistencia exista
    const asistenciaExistente = await prisma.asistencia.findUnique({
        where: { id_asistencia },
    });

    if (!asistenciaExistente) {
        throw new Error(`La asistencia con ID ${id_asistencia} no existe.`);
    }

    // Eliminar la Asistencia
    const asistenciaEliminada = await prisma.asistencia.delete({
        where: { id_asistencia },
    });

    return asistenciaEliminada;
};

/**
 * �� Obtener la Asistencia más reciente de un Usuario
 * @param {number} id_usuario - ID del Usuario
 * @returns {Promise<Object>} Asistencia más reciente del Usuario
 * @private
 * @returns {Promise<Object>} Asistencia
 * @private
 * @param {number} id
 * @returns {Promise<Object>} Asistencia
 **/


export const obtenerUltimaAsistencia = async (id_usuario) => {
  if (isNaN(id_usuario)) {
      throw new Error("El ID de usuario debe ser válido.");
  }

  const ultimaAsistencia = await prisma.asistencia.findFirst({
      where: {
          id_usuario: parseInt(id_usuario),
      },
      orderBy: { fecha_hora: "desc" },
      include: {
          embarcacion: true,
          usuario: true,
      },
  });

  if (!ultimaAsistencia) {
      throw new Error(`No se encontró ninguna asistencia para el usuario con ID ${id_usuario}.`);
  }

  return ultimaAsistencia;
};
