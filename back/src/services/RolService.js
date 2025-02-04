import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo rol
export const createRol = async (nombre_rol, descripcion) => {
  if (!nombre_rol) {
    throw new Error("El nombre del rol es obligatorio.");
  }

  // Buscar si el rol ya existe
  const rolExistente = await prisma.rol.findUnique({
    where: { nombre_rol },
  });

  if (rolExistente) {
    if (rolExistente.estado) {
      throw new Error(
        `El rol con el nombre "${nombre_rol}" ya existe y está activo.`
      );
    } else {
      // Reactivar el rol existente
      const fecha_actualizacion = getUTCTime(new Date().toISOString());

      const rolReactivado = await prisma.rol.update({
        where: { id: rolExistente.id },
        data: {
          estado: true,
          descripcion: descripcion || rolExistente.descripcion,
          actualizado_en: fecha_actualizacion,
        },
      });

      return rolReactivado;
    }
  }

  // Crear un nuevo rol si no existe
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);

  const nuevoRol = await prisma.rol.create({
    data: {
      nombre_rol,
      descripcion,
      creado_en: fecha_creacion,
      actualizado_en: fecha_creacion,
    },
  });

  return nuevoRol;
};

// 🔹 Obtener todos los roles
export const getAllRoles = async (filters, page = 1, pageSize = 10) => {
  const { nombre_rol, estado } = filters;

  // Construcción dinámica de filtros
  const whereClause = {
    estado: estado !== undefined ? estado === "true" : true, // Filtra por estado activo por defecto
  };

  if (nombre_rol) {
    whereClause.nombre_rol = { contains: nombre_rol }; // Filtra por nombre_rol si se proporciona
  }

  const skip = (page - 1) * pageSize; // Calcular cuántos registros omitir

  // Obtener roles y total de registros en paralelo
  const [roles, total] = await Promise.all([
    prisma.rol.findMany({
      where: whereClause,
      orderBy: { creado_en: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.rol.count({ where: whereClause }), // Contar total de registros filtrados
  ]);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    data: roles,
  };
};

// Obtener un rol por su ID
export const getRolById = async (id) => {
  if (!id) {
    throw new Error("El ID del rol es obligatorio.");
  }

  const rol = await prisma.rol.findUnique({
    where: { id: parseInt(id) },
  });

  if (!rol || !rol.estado) {
    throw new Error(`El rol con ID ${id} no existe o está inactivo.`);
  }

  return rol;
};

// Actualizar un rol
export const updateRol = async (id, nombre_rol, descripcion) => {
    if (!id || !nombre_rol) {
      throw new Error("El ID y el nombre del rol son obligatorios.");
    }
  
    // Verificar si el rol existe y está activo
    const rol = await prisma.rol.findUnique({
      where: { id: parseInt(id) },
    });
    if (!rol || !rol.estado) {
      throw new Error(`El rol con ID ${id} no existe o está inactivo.`);
    }
  
    // Puedes agregar una verificación previa para ver si existe otro rol con el mismo nombre
    // (esto es opcional si deseas manejarlo manualmente)
    const rolConMismoNombre = await prisma.rol.findFirst({
      where: {
        nombre_rol,
        id: { not: parseInt(id) },
      },
    });
    if (rolConMismoNombre) {
      throw new Error(`Ya existe un rol con el nombre "${nombre_rol}".`);
    }
  
    // Actualizar el rol
    try {
      const todayISO = new Date().toISOString();
      // Suponiendo que tienes una función getUTCTime para formatear la fecha:
      const fecha_actualizacion = getUTCTime(todayISO);
  
      const rolActualizado = await prisma.rol.update({
        where: { id: parseInt(id) },
        data: {
          nombre_rol,
          descripcion,
          actualizado_en: fecha_actualizacion,
        },
      });
  
      return rolActualizado;
    } catch (err) {
      // Prisma usa el código P2002 para errores de restricción única
      if (err.code === "P2002" && err.meta && err.meta.target.includes("nombre_rol")) {
        throw new Error(`El nombre "${nombre_rol}" ya está en uso. Por favor, elige otro nombre.`);
      }
      // Si es otro tipo de error, lo relanzas o lanzas un mensaje genérico
      throw new Error(err.message || "Error al actualizar el rol.");
    }
  };
  

// Eliminar (desactivar) un rol
export const deleteRol = async (id) => {
  if (!id) {
    throw new Error("El ID del rol es obligatorio.");
  }

  const rol = await prisma.rol.findUnique({
    where: { id: parseInt(id) },
  });

  if (!rol || !rol.estado) {
    throw new Error(`El rol con ID ${id} no existe o ya está inactivo.`);
  }

  const rolDesactivado = await prisma.rol.update({
    where: { id: parseInt(id) },
    data: { estado: false },
  });

  return rolDesactivado;
};
