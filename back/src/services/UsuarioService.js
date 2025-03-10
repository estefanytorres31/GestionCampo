import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo usuario
export const createUsuario = async (
  nombre_usuario,
  contrasena_hash,
  nombre_completo,
  email
) => {
  if (!nombre_usuario || !contrasena_hash || !nombre_completo || !email) {
    throw new Error(
      "Todos los campos son obligatorios: nombre_usuario, contraseña, nombre_completo, email."
    );
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { nombre_usuario },
  });

  const fecha_actualizacion = getUTCTime(new Date().toISOString());

  if (usuarioExistente) {
    if (usuarioExistente.estado) {
      throw new Error(
        `El usuario con el nombre "${nombre_usuario}" ya existe y está activo.`
      );
    }

    // Reactivar el usuario desactivado
    const usuarioReactivado = await prisma.usuario.update({
      where: { id: usuarioExistente.id },
      data: {
        estado: true,
        actualizado_en: fecha_actualizacion,
      },
    });

    return usuarioReactivado;
  }

  // Si el usuario no existe, lo creamos desde cero
  const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
  const fecha_creacion = getUTCTime(new Date().toISOString());

  const newUser = await prisma.usuario.create({
    data: {
      nombre_usuario,
      contrasena_hash: hashedPassword,
      nombre_completo,
      email,
      estado: true, // Se asegura de que el usuario se cree activo
      creado_en: fecha_creacion,
      actualizado_en: fecha_creacion,
    },
  });

  return newUser;
};

// 🔹 Obtener todos los usuarios con sus roles (filtrando roles inactivos y mostrando solo el nombre del rol)
export const getAllUsers = async (filters, page = 1, pageSize = 10) => {
    const { nombre_usuario, email, estado, rol_id } = filters;
  
    // Construcción dinámica de filtros para el usuario
    const whereClause = {
      estado: estado !== undefined ? estado === "true" : true, // Filtra por estado (true por defecto)
    };
  
    if (nombre_usuario) {
      whereClause.nombre_usuario = { contains: nombre_usuario };
    }
  
    if (email) {
      whereClause.email = { contains: email };
    }
  
    // Filtrado por rol_id (si está presente)
    if (rol_id) {
      whereClause.usuario_roles = {
        some: { rol_id: parseInt(rol_id, 10) },
      };
    }
  
    const skip = (page - 1) * pageSize; // Calcular cuántos registros omitir
  
    // Consulta a la base de datos
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where: whereClause,
        include: {
          // Incluimos la relación para obtener el estado del registro en usuario_roles
          usuario_roles: {
            select: {
              estado: true, // Estado del registro en la tabla intermedia (usuario_roles)
              rol: {
                select: {
                  nombre_rol: true,
                },
              },
            },
          },
        },
        orderBy: { creado_en: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.usuario.count({ where: whereClause }),
    ]);
  
    // Transformación de los datos:
    // Para cada usuario, filtramos los registros de usuario_roles para conservar solo aquellos activos y mapeamos cada registro a su nombre de rol.
    const usuariosTransformados = usuarios.map(({ usuario_roles, contrasena_hash, ...user }) => ({
      ...user,
      roles: usuario_roles
        .filter((r) => r.estado) // Filtramos asociaciones inactivas
        .map((r) => r.rol.nombre_rol), // Extraemos solo el nombre del rol
    }));
  
    return {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: usuariosTransformados,
    };
  };
  
export const getFilteredUsers = async (filters) => {
  const { nombre_usuario, email, estado, rol_id } = filters;

  // Construcción dinámica de filtros
  const whereClause = {
    estado: estado !== undefined ? estado === "true" : true, // Filtra por estado (true por defecto)
  };

  if (nombre_usuario) {
    whereClause.nombre_usuario = { contains: nombre_usuario };
  }

  if (email) {
    whereClause.email = { contains: email };
  }

  // Filtrado por rol_id (si está presente)
  if (rol_id) {
    whereClause.usuario_roles = {
      some: { rol_id: parseInt(rol_id, 10) },
    };
  }

  const usuarios = await prisma.usuario.findMany({
    where: whereClause,
    include: {
      usuario_roles: {
        include: {
          rol: true,
        },
      },
    },
    orderBy: { creado_en: "desc" },
  });

  if (usuarios.length === 0) {
    throw new Error(
      "No se encontraron usuarios con los filtros proporcionados."
    );
  }

  return usuarios;
};

export const getUserByUsername = async (nombre_usuario) => {
  const user = await prisma.usuario.findFirst({
    where: {
      nombre_usuario: nombre_usuario,
      estado: true,
    },
  });

  if (user.length === 0) {
    throw new Error("No hay usuarios disponibles.");
  }

  return user;
};

// Obtener un usuario por su ID
export const getUserById = async (id) => {
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    throw new Error("El ID proporcionado no es válido.");
  }

  const user = await prisma.usuario.findFirst({
    where: { id: userId, estado: true },
    include: {
      usuario_roles: {
        include: { rol: true },
      },
    },
  });

  if (!user) {
    throw new Error(`El usuario con ID ${id} no existe o está inactivo.`);
  }

  return user;
};

// Actualizar un usuario
export const updateUser = async (
  id,
  nombre_usuario,
  nombre_completo,
  email,
  contrasena_hash
) => {
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    throw new Error("El ID proporcionado no es válido.");
  }

  // Buscamos el usuario a actualizar
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
  });

  if (!user || !user.estado) {
    throw new Error(`El usuario con ID ${id} no existe o está inactivo.`);
  }

  // Verificamos si el nuevo nombre de usuario ya está en uso por otro usuario
  if (nombre_usuario !== user.nombre_usuario) {
    const existingUser = await prisma.usuario.findUnique({
      where: { nombre_usuario },
    });

    if (existingUser) {
      throw new Error("El nombre de usuario ya está en uso por otro usuario.");
    }
  }

  const fecha_actualizacion = getUTCTime(new Date().toISOString());

  // Preparamos los datos a actualizar
  const updatedData = {
    nombre_usuario,
    nombre_completo,
    email,
    actualizado_en: fecha_actualizacion,
  };

  // Si se proporciona una nueva contraseña, la hasheamos y la incluimos
  if (contrasena_hash && contrasena_hash.trim().length > 0) {
    const hashedPassword = await bcrypt.hash(contrasena_hash, 10);
    updatedData.contrasena_hash = hashedPassword;
  }
  const updatedUser = await prisma.usuario.update({
    where: { id: userId },
    data: updatedData,
  });

  const usuario = {
    id: updatedUser.id,
    nombre_usuario: updatedUser.nombre_usuario,
    nombre_completo: updatedUser.nombre_completo,
    email: updatedUser.email,
    creado_en: updatedUser.creado_en,
    actualizado_en: updatedUser.actualizado_en,
  };

  return usuario;
};

// Eliminar (desactivar) un usuario
export const deleteUser = async (id) => {
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    throw new Error("El ID proporcionado no es válido.");
  }

  const user = await prisma.usuario.findUnique({
    where: { id: userId },
  });

  if (!user || !user.estado) {
    throw new Error(`El usuario con ID ${id} no existe o ya está inactivo.`);
  }

  const deletedUser = await prisma.usuario.update({
    where: { id: userId },
    data: { estado: false },
  });

  return deletedUser;
};
