import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Jwt.js";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();
const PEPPER = process.env.PEPPER_SECRET || "fallbackPepper"; // Usa un valor por defecto si no está definido

export const login = async (nombreUsuario, contrasena) => {
  // Buscar el usuario por nombre_usuario y obtener sus roles activos
  const usuario = await prisma.usuario.findUnique({
    where: { nombre_usuario: nombreUsuario },
    include: {
      usuario_roles: {
        where: { estado: true },
        include: { rol: true },
      },
    },
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }
  
  // Verificar si el usuario está inactivo
  if (usuario.estado === 0) {
    throw new Error("El usuario está inactivo y no puede iniciar sesión");
  }
  

  // 🔑 Agregar el pepper a la contraseña ingresada
  const contrasenaPepper = contrasena + PEPPER;

  // Verificar la contraseña con bcrypt.compare
  const valido = await bcrypt.compare(contrasenaPepper, usuario.contrasena_hash);
  if (!valido) {
    throw new Error("Contraseña incorrecta");
  }

  // Obtener los nombres de los roles
  const roles = usuario.usuario_roles.map((ur) => ur.rol.nombre_rol);

  // Obtener tanto el id como el nombre de cada rol
  const rolesPorId = usuario.usuario_roles.map((ur) => ({
    id: ur.rol.id,
    nombre: ur.rol.nombre_rol,
  }));

  // Buscar la configuración de tema para el usuario
  const userThemeRecord = await prisma.usuarioConfiguracion.findFirst({
    where: {
      usuarioId: usuario.id,
      configuracion: { nombre: "theme" },
      estado: true,
    },
    select: { valor: true },
  });

  const userTheme = userThemeRecord ? userThemeRecord.valor : "light";

  // Preparar el payload y generar el token
  const payload = {
    userId: usuario.id,
    nombreUsuario: usuario.nombre_usuario,
    roles,
  };

  const token = createToken(payload);
  const expiresInMilliseconds = 24 * 60 * 60 * 1000;
  const expirationUTC = new Date(Date.now() + expiresInMilliseconds);
  const expirationPeru = getUTCTime(expirationUTC.toISOString());

  return {
    token,
    expiracion: expirationPeru.toISOString(),
    userId: usuario.id,
    nombreUsuario: usuario.nombre_usuario,
    nombreCompleto: usuario.nombre_completo,
    roles,
    rolesPorId,
    theme: userTheme,
  };
};

export const logout = async (token) => {
  // Implementa la lógica de logout si es necesario
};
