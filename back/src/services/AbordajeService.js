import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crea un nuevo registro de abordaje o reactiva uno inactivo existente.
 * @param {Object} data - Datos para crear o reactivar el abordaje.
 * @param {number} data.id_orden_trabajo_usuario - ID del usuario asignado a la orden de trabajo.
 * @param {string} data.fecha - Fecha de la sesión de abordaje (en formato ISO).
 * @param {string} [data.motorista] - Motorista asignado en el abordaje.
 * @param {string} [data.supervisor] - Supervisor asignado en el abordaje.
 * @param {number} data.id_puerto - ID del puerto relacionado al abordaje.
 * @returns {Promise<Object>} - El registro de abordaje creado o reactivado.
 */
export const createAbordaje = async (data) => {
  const { id_orden_trabajo_usuario, motorista, supervisor, id_puerto } =
    data;

  // Validación de campos obligatorios
  if (!id_orden_trabajo_usuario || !id_puerto) {
    throw new Error(
      "Los campos id_orden_trabajo_usuario, fecha e id_puerto son obligatorios."
    );
  }

  // Validar que los IDs sean números válidos
  const ordenUsuarioId = parseInt(id_orden_trabajo_usuario, 10);
  const puertoId = parseInt(id_puerto, 10);
  if (isNaN(ordenUsuarioId)) {
    throw new Error(
      "El campo id_orden_trabajo_usuario debe ser un número válido."
    );
  }
  if (isNaN(puertoId)) {
    throw new Error("El campo id_puerto debe ser un número válido.");
  }

  // Convertir la fecha a UTC utilizando la función getUTCTime

  const fechaActual = getUTCTime(new Date().toISOString());

  // Validar que la OrdenTrabajoUsuario exista
  const ordenTrabajoUsuarioExistente =
    await prisma.ordenTrabajoUsuario.findUnique({
      where: { id_orden_trabajo_usuario: ordenUsuarioId },
    });
  if (!ordenTrabajoUsuarioExistente) {
    throw new Error(
      `No se encontró una OrdenTrabajoUsuario con el id ${ordenUsuarioId}.`
    );
  }

  // Validar que el Puerto exista
  const puertoExistente = await prisma.puerto.findUnique({
    where: { id_puerto: puertoId },
  });
  if (!puertoExistente) {
    throw new Error(`No se encontró un puerto con el id ${puertoId}.`);
  }

  // Verificar si ya existe un abordaje para ese usuario en la misma fecha (por la constraint única)
  const abordajeExistente = await prisma.abordaje.findFirst({
    where: {
      id_orden_trabajo_usuario: ordenUsuarioId,
      fecha: fechaActual,
    },
  });

  if (abordajeExistente) {
    // Si ya existe y está activo, no se permite duplicar
    if (abordajeExistente.estado === true) {
      throw new Error(
        "Ya existe un abordaje activo para este usuario en la fecha proporcionada."
      );
    } else {
      // Si existe pero está inactivo, se reactivará actualizando el estado y demás campos
      try {
        const reactivado = await prisma.abordaje.update({
          where: { id: abordajeExistente.id },
          data: {
            estado: true,
            // Si se envían nuevos valores, se actualizan; de lo contrario, se conserva lo anterior
            motorista: motorista
              ? String(motorista)
              : abordajeExistente.motorista,
            supervisor: supervisor
              ? String(supervisor)
              : abordajeExistente.supervisor,
            id_puerto: puertoId,
          },
        });
        return reactivado;
      } catch (error) {
        console.error("Error al reactivar el abordaje:", error);
        throw new Error(
          "Error al reactivar el abordaje. Por favor, verifica los datos ingresados."
        );
      }
    }
  }

  // Si no existe, se crea un nuevo registro con estado por defecto en true.
  try {
    const nuevoAbordaje = await prisma.abordaje.create({
      data: {
        id_orden_trabajo_usuario: ordenUsuarioId,
        fecha: fechaActual,
        motorista: motorista ? String(motorista) : null,
        supervisor: supervisor ? String(supervisor) : null,
        id_puerto: puertoId,
        creado_en:fechaActual,
        actualizado_en:fechaActual,
        estado: true, // Se asegura que se cree activo
      },
    });
    return nuevoAbordaje;
  } catch (error) {
    console.error("Error al crear el abordaje:", error);
    throw new Error(
      "Error al crear el abordaje. Por favor, verifica los datos ingresados."
    );
  }
};

/**
 * Obtiene todos los registros de abordaje activos.
 * @returns {Promise<Array>} - Lista de abordajes activos.
 */
export const getAllAbordajes = async () => {
  const abordajes = await prisma.abordaje.findMany({
    where: { estado: true },
  });

  if (!abordajes || abordajes.length === 0) {
    throw new Error("No hay registros de abordaje disponibles.");
  }

  return abordajes;
};

/**
 * Obtiene todos los registros de abordaje activos para una orden de trabajo.
 * @param {number} idOrdenTrabajo - ID de la orden de trabajo.
 * @returns {Promise<Array>} - Lista de abordajes activos para la orden.
 */
export const getAbordajesByOrdenTrabajo = async (idOrdenTrabajo) => {
    if (!idOrdenTrabajo) {
      throw new Error("El ID de la orden de trabajo es obligatorio.");
    }
  
    const orderId = parseInt(idOrdenTrabajo, 10);
    if (isNaN(orderId)) {
      throw new Error("El ID de la orden de trabajo debe ser un número válido.");
    }
  
    // Se buscan los abordajes cuyo usuario (OrdenTrabajoUsuario) esté vinculado a la orden de trabajo dada.
    const abordajes = await prisma.abordaje.findMany({
      where: {
        estado: true,
        ordenTrabajoUsuario: {
          id_orden_trabajo: orderId,
        },
      },
      orderBy: { fecha: "desc" },
    });
  
    if (!abordajes || abordajes.length === 0) {
      throw new Error("No hay registros de abordaje disponibles para esta orden de trabajo.");
    }
  
    return abordajes;
  };  

/**
 * Obtiene un registro de abordaje activo por su ID.
 * @param {number} id - ID del abordaje.
 * @returns {Promise<Object>} - Registro de abordaje activo.
 */
export const getAbordajeById = async (id) => {
  if (!id) {
    throw new Error("El ID del abordaje es obligatorio.");
  }

  const abordaje = await prisma.abordaje.findFirst({
    where: { id: parseInt(id, 10), estado: true },
  });

  if (!abordaje) {
    throw new Error(`El abordaje con ID ${id} no existe o está inactivo.`);
  }

  return abordaje;
};

/**
 * Obtiene un registro de abordaje activo por su ID, incluyendo:
 * - El usuario asignado (ordenTrabajoUsuario)
 * - Los registros de sistemas (ordenTrabajoSistemas)
 *   y dentro de cada uno, las partes (orden_trabajo_parte) filtradas por id_abordaje.
 * @param {number} id - ID del abordaje.
 * @returns {Promise<Object>} - Registro de abordaje activo con las relaciones solicitadas.
 */
export const getAbordajeUserSistemaParteById = async (id) => {
    if (!id) {
      throw new Error("El ID del abordaje es obligatorio.");
    }
    
    const abordajeId = parseInt(id, 10);
    if (isNaN(abordajeId)) {
      throw new Error("El ID del abordaje debe ser un número válido.");
    }
  
    const abordaje = await prisma.abordaje.findFirst({
      where: { id: abordajeId, estado: true },
      include: {
        // Incluye el usuario asignado a la OT
        ordenTrabajoUsuario: true,
        // Incluye los registros de sistema asociados a este abordaje
        ordenTrabajoSistemas: {
          include: {
            // Dentro de cada registro de sistema, se incluyen las partes asociadas
            // filtradas para que tengan el id_abordaje igual al abordaje consultado.
            orden_trabajo_parte: {
              where: { id_abordaje: abordajeId },
            },
          },
        },
      },
    });
  
    if (!abordaje) {
      throw new Error(`El abordaje con ID ${id} no existe o está inactivo.`);
    }
  
    return abordaje;
  };
  
/**
 * Actualiza un registro de abordaje existente.
 * @param {number} id - ID del abordaje a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @param {string} [data.fecha] - Nueva fecha (en formato ISO) para el abordaje.
 * @param {string} [data.motorista] - Nuevo motorista.
 * @param {string} [data.supervisor] - Nuevo supervisor.
 * @param {number} [data.id_puerto] - Nuevo ID de puerto.
 * @returns {Promise<Object>} - Registro de abordaje actualizado.
 */
export const updateAbordaje = async (id, data) => {
  if (!id) {
    throw new Error("El ID del abordaje es obligatorio.");
  }

  // Validar que el id sea un número
  const abordajeId = parseInt(id, 10);
  if (isNaN(abordajeId)) {
    throw new Error("El ID del abordaje debe ser un número válido.");
  }

  // Verificar que el abordaje exista y esté activo
  const abordajeExistente = await prisma.abordaje.findFirst({
    where: { id: abordajeId, estado: true },
  });
  if (!abordajeExistente) {
    throw new Error(`El abordaje con ID ${id} no existe o está inactivo.`);
  }

  // Construir el objeto de actualización
  const updateData = {};

  // Validar y actualizar la fecha
  if (data.fecha) {
    const fechaDate = new Date(data.fecha);
    if (isNaN(fechaDate.getTime())) {
      throw new Error("El campo fecha debe ser una fecha válida.");
    }
    updateData.fecha = getUTCTime(data.fecha);
  }

  // Validar y actualizar motorista
  if (data.motorista !== undefined) {
    if (typeof data.motorista !== "string") {
      throw new Error("El campo motorista debe ser un string.");
    }
    updateData.motorista = data.motorista;
  }

  // Validar y actualizar supervisor
  if (data.supervisor !== undefined) {
    if (typeof data.supervisor !== "string") {
      throw new Error("El campo supervisor debe ser un string.");
    }
    updateData.supervisor = data.supervisor;
  }

  // Validar y actualizar id_puerto
  if (data.id_puerto !== undefined) {
    const puertoId = parseInt(data.id_puerto, 10);
    if (isNaN(puertoId)) {
      throw new Error("El campo id_puerto debe ser un número válido.");
    }
    // Verificar que el puerto exista
    const puertoExistente = await prisma.puerto.findUnique({
      where: { id_puerto: puertoId },
    });
    if (!puertoExistente) {
      throw new Error(`No se encontró un puerto con el id ${puertoId}.`);
    }
    updateData.id_puerto = puertoId;
  }

  try {
    const fechaActual = getUTCTime(new Date().toISOString());
    const abordajeActualizado = await prisma.abordaje.update({
      where: { id: abordajeId },
      data: {
        ...updateData,
        actualizado_en: fechaActual, // Aunque @updatedAt lo actualiza automáticamente, lo dejamos explícito si se requiere.
      },
    });

    return abordajeActualizado;
  } catch (error) {
    console.error("Error al actualizar abordaje:", error);
    throw new Error(
      "Error al actualizar el abordaje. Por favor, verifica los datos ingresados."
    );
  }
};

/**
 * Elimina (soft delete) un registro de abordaje actualizando su estado de true a false.
 * @param {number} id - ID del abordaje a eliminar.
 * @returns {Promise<Object>} - Registro de abordaje actualizado.
 */
export const deleteAbordaje = async (id) => {
  if (!id) {
    throw new Error("El ID del abordaje es obligatorio.");
  }

  // Verificar que el registro exista y esté activo
  const abordaje = await prisma.abordaje.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!abordaje) {
    throw new Error(`El abordaje con ID ${id} no existe.`);
  }

  if (!abordaje.estado) {
    throw new Error(`El abordaje con ID ${id} ya se encuentra inactivo.`);
  }

  const fechaActual = getUTCTime(new Date().toISOString());

  // Actualizar el estado a false (soft delete)
  const abordajeActualizado = await prisma.abordaje.update({
    where: { id: parseInt(id, 10) },
    data: { estado: false, actualizado_en: fechaActual },
  });

  return abordajeActualizado;
};
