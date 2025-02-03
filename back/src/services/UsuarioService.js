import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear un nuevo usuario
export const createUsuario = async (nombre_usuario, contrasena_hash, nombre_completo, email) => {
    if (!nombre_usuario || !contrasena_hash || !nombre_completo || !email) {
        throw new Error("Todos los campos son obligatorios: nombre_usuario, contraseña, nombre_completo, email.");
    }

    const usuarioExistente = await prisma.usuario.findUnique({
        where: { nombre_usuario },
    });

    const fecha_actualizacion = getUTCTime(new Date().toISOString());

    if (usuarioExistente) {
        if (usuarioExistente.estado) {
            throw new Error(`El usuario con el nombre "${nombre_usuario}" ya existe y está activo.`);
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

// 🔹 Obtener todos los usuarios con sus roles
export const getAllUsers = async (filters, page = 1, pageSize = 10) => {
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

    const skip = (page - 1) * pageSize; // Calcular cuántos registros omitir

    const [usuarios, total] = await Promise.all([
        prisma.usuario.findMany({
            where: whereClause,
            include: {
                usuario_roles: {
                    select: {
                        rol: { select: { nombre_rol: true } }, // Solo traemos el nombre del rol
                    },
                },
            },
            orderBy: { creado_en: "desc" },
            skip,
            take: pageSize,
        }),
        prisma.usuario.count({ where: whereClause }),
    ]);

    // Transformar los datos para incluir solo una lista de nombres de roles y excluir `usuario_roles`
    const usuariosTransformados = usuarios.map(({ usuario_roles, contrasena_hash, ...user }) => ({
        ...user,
        roles: usuario_roles.map(r => r.rol.nombre_rol), // Extraemos solo los nombres de los roles
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
        throw new Error("No se encontraron usuarios con los filtros proporcionados.");
    }

    return usuarios;
};

export const getUserByUsername=async(nombre_usuario)=>{
    const user = await prisma.usuario.findFirst({
        where:{
            nombre_usuario: nombre_usuario,
            estado: true
        }
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
export const updateUser = async (id, nombre_usuario, nombre_completo, email) => {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        throw new Error("El ID proporcionado no es válido.");
    }

    const user = await prisma.usuario.findUnique({
        where: { id: userId },
    });

    if (!user || !user.estado) {
        throw new Error(`El usuario con ID ${id} no existe o está inactivo.`);
    }

    const fecha_actualizacion = getUTCTime(new Date().toISOString());

    const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: {
            nombre_usuario,
            nombre_completo,
            email,
            actualizado_en: fecha_actualizacion,
        },
    });

    const usuario={
        id:updatedUser.id,
        nombre_usuario:updatedUser.nombre_usuario,
        nombre_completo:updatedUser.nombre_completo,
        email:updatedUser.email,
        creado_en:updatedUser.creado_en,
        actualizado_en: updatedUser.actualizado_en,
    }
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

