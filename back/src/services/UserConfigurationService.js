import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Crea o actualiza la configuración de tema para un usuario.
 * Si la configuración "theme" no existe, se crea automáticamente.
 * @param {number} usuarioId - ID del usuario.
 * @param {string} themeValue - Valor del tema (por ejemplo, "darkblue").
 * @returns {Promise<Object>} - Registro creado o actualizado.
 */
export const setUserTheme = async (usuarioId, themeValue) => {
  // Declaramos con let para poder reasignar si no se encuentra la configuración
  let configuracion = await prisma.configuracion.findUnique({
    where: { nombre: "theme" },
  });

  if (!configuracion) {
    configuracion = await prisma.configuracion.create({
      data: {
        nombre: "theme",
        descripcion: "Configuración de tema del usuario",
        defaultValue: "light",
        estado: true,
      },
    });
  }
  
  // Buscar si ya existe un registro para este usuario y configuración
  const existingRecord = await prisma.usuarioConfiguracion.findUnique({
    where: {
      usuarioId_configuracionId: {
        usuarioId: usuarioId,
        configuracionId: configuracion.id,
      },
    },
  });
  
  if (existingRecord) {
    // Actualizar el registro y reactivar si estaba inactivo
    const updatedRecord = await prisma.usuarioConfiguracion.update({
      where: { id: existingRecord.id },
      data: {
        valor: themeValue,
        estado: true,
      },
    });
    return updatedRecord;
  } else {
    // Crear nuevo registro
    const newRecord = await prisma.usuarioConfiguracion.create({
      data: {
        usuarioId,
        configuracionId: configuracion.id,
        valor: themeValue,
        estado: true,
      },
    });
    return newRecord;
  }
};

/**
 * Obtiene la configuración de tema de un usuario.
 * @param {number} usuarioId - ID del usuario.
 * @returns {Promise<Object|null>} - Registro de configuración o null si no existe.
 */
export const getUserTheme = async (usuarioId) => {
  const configuracion = await prisma.configuracion.findUnique({
    where: { nombre: "theme" },
  });
  if (!configuracion) return null;
  
  const record = await prisma.usuarioConfiguracion.findUnique({
    where: {
      usuarioId_configuracionId: {
        usuarioId,
        configuracionId: configuracion.id,
      },
    },
  });
  return record;
};
