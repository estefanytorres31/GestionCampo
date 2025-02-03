import { getUTCTime } from "../utils/Time.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear un nuevo permiso
export const createPermiso = async (nombre, descripcion) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    if (!nombre) {
        throw new Error("El nombre del permiso es obligatorio.");
    }

    // Verificar si el permiso ya existe (incluyendo los inactivos)
    const permisoExistente = await prisma.permiso.findUnique({
        where: { nombre },
    });

    if (permisoExistente) {
        if (!permisoExistente.estado) {
            // Si el permiso existe pero está inactivo, lo reactivamos
            return await prisma.permiso.update({
                where: { id: permisoExistente.id },
                data: {
                    estado: true,
                    actualizado_en: getUTCTime(new Date()),
                },
            });
        }
        throw new Error(`El permiso con el nombre "${nombre}" ya existe y está activo.`);
    }

    const nuevoPermiso = await prisma.permiso.create({
        data: {
            nombre,
            descripcion,
            creado_en: fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    return nuevoPermiso;
};

// 🔹 Obtener todos los permisos con paginación
export const getAllPermisos = async (filters, page = 1, pageSize = 10) => {
    const { nombre, estado } = filters;

    // Construcción dinámica de filtros
    const whereClause = {
        estado: estado !== undefined ? estado === "true" : true, // Filtra por estado activo por defecto
    };

    if (nombre) {
        whereClause.nombre = { contains: nombre }; // Filtra por nombre si está presente
    }

    const skip = (page - 1) * pageSize; // Calcular cuántos registros omitir

    // Obtener permisos y total de registros en paralelo
    const [permisos, total] = await Promise.all([
        prisma.permiso.findMany({
            where: whereClause,
            orderBy: { creado_en: "desc" },
            skip,
            take: pageSize,
        }),
        prisma.permiso.count({ where: whereClause }), // Obtener total de registros filtrados
    ]);

    return {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: permisos,
    };
};

// Obtener un permiso por su ID
export const getPermisoById = async (id) => {
    const permisoId = parseInt(id, 10);
    if (isNaN(permisoId)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    const permiso = await prisma.permiso.findUnique({
        where: { id: permisoId },
    });

    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${id} no existe o está inactivo.`);
    }

    return permiso;
};

// Actualizar un permiso
export const updatePermiso = async (id, nombre, descripcion) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const permisoId = parseInt(id, 10);

    if (isNaN(permisoId)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    // Verificar si el permiso existe
    const permisoExistente = await prisma.permiso.findUnique({
        where: { id: permisoId },
    });

    if (!permisoExistente || !permisoExistente.estado) {
        throw new Error(`El permiso con ID ${id} no existe o está inactivo.`);
    }

    // Verificar si el nuevo nombre ya está en uso (excluyendo el permiso actual)
    if (nombre && nombre !== permisoExistente.nombre) {
        const nombreEnUso = await prisma.permiso.findUnique({
            where: { nombre },
        });
        if (nombreEnUso) {
            throw new Error(`El permiso con el nombre "${nombre}" ya existe.`);
        }
    }

    // Actualizar el permiso con fecha actualizada
    const fecha_actualizacion = getUTCTime(new Date());
    const permisoActualizado = await prisma.permiso.update({
        where: { id: permisoId },
        data: {
            nombre: nombre || permisoExistente.nombre,
            descripcion: descripcion !== undefined ? descripcion : permisoExistente.descripcion,
            actualizado_en:fecha_creacion
        },
    });

    return permisoActualizado;
};

// Eliminar (desactivar) un permiso
export const deletePermiso = async (id) => {
    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);
    const permisoId = parseInt(id, 10);

    if (isNaN(permisoId)) {
        throw new Error("El ID del permiso debe ser un número válido.");
    }

    // Verificar si el permiso existe y está activo
    const permiso = await prisma.permiso.findUnique({
        where: { id: permisoId },
    });

    if (!permiso || !permiso.estado) {
        throw new Error(`El permiso con ID ${id} no existe o ya está inactivo.`);
    }

    // Desactivar el permiso y actualizar la fecha
    const permisoDesactivado = await prisma.permiso.update({
        where: { id: permisoId },
        data: { estado: false, actualizado_en:fecha_creacion },
    });

    return permisoDesactivado;
};
