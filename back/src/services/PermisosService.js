import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear un nuevo permiso
export const createPermiso = async (data) => {
  try {
    const nuevoPermiso = await prisma.permiso.create({
      data,
    });
    return nuevoPermiso;
  } catch (error) {
    console.error("Error al crear permiso:", error);
    throw error;
  }
};

// Obtener todos los permisos
export const getPermisos = async () => {
  try {
    const permisos = await prisma.permiso.findMany();
    return permisos;
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    throw error;
  }
};

// Obtener un permiso por ID
export const getPermisoById = async (id) => {
  try {
    const permiso = await prisma.permiso.findUnique({
      where: { id },
    });
    return permiso;
  } catch (error) {
    console.error("Error al obtener permiso por ID:", error);
    throw error;
  }
};

// Actualizar un permiso
export const updatePermiso = async (id, data) => {
  try {
    const permisoActualizado = await prisma.permiso.update({
      where: { id },
      data,
    });
    return permisoActualizado;
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    throw error;
  }
};

// Eliminar un permiso
export const deletePermiso = async (id) => {
  try {
    const permisoEliminado = await prisma.permiso.delete({
      where: { id },
    });
    return permisoEliminado;
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    throw error;
  }
};
