import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Jwt.js";
import { getPeruTime, getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

export const login = async (nombreUsuario, contrasena_hash) => {
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

  // Verificar la contraseña
  const valido = bcrypt.compareSync(contrasena_hash, usuario.contrasena_hash);
  if (!valido) {
    throw new Error("Contraseña incorrecta");
  }

  // Obtener los nombres de los roles
  const roles = usuario.usuario_roles.map((ur) => ur.rol.nombre_rol);

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
    roles,
    theme: userTheme, // Se agrega el tema configurado o "light" por defecto
  };
};

export const logout = async (token) => {
  // Implementa la lógica de logout si es necesario
};
