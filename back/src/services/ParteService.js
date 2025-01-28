import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

// Crear una parte con validación y formateo de fecha
export const createParte = async (nombre_parte) => {
    if (!nombre_parte || typeof nombre_parte !== "string") {
        throw new Error("El nombre de la parte es obligatorio y debe ser una cadena.");
    }

    const todayISO = new Date().toISOString();
    const fecha_creacion = getUTCTime(todayISO);

    const newParte = await prisma.parte.create({
        data: {
            nombre_parte,
            creado_en: fecha_creacion,
            actualizado_en: fecha_creacion,
        },
    });

    return newParte;
};

// Obtener todas las partes activas
export const getAllPartes = async () => {
    const partes = await prisma.parte.findMany({
        where: {
            estado: true,
        },
        orderBy: {
            creado_en: "desc",
        },
    });

    if (partes.length === 0) {
        throw new Error("No se encontraron partes activas.");
    }

    return partes;
};

// Obtener una parte por su ID con validación
export const getParteById = async (id_parte) => {
    const parsedId = parseInt(id_parte, 10);
    console.log("id_parte es tipo", typeof(id_parte) +  id_parte)
    if (isNaN(parsedId) || parsedId <= 0) {
        throw new Error("El ID proporcionado no es válido.");
    }

    const parte = await prisma.parte.findUnique({
        where: {
            id_parte: parsedId,
        },
    });

    if (!parte || !parte.estado) {
        throw new Error("La parte no existe o está desactivada.");
    }

    return parte;
};


// Actualizar una parte
export const updateParte = async (id_parte, nombre_parte) => {
    const parsedId = parseInt(id_parte, 10);
    if (isNaN(parsedId)) {
        throw new Error("El ID proporcionado no es válido.");
    }

    if (!nombre_parte || typeof nombre_parte !== "string") {
        throw new Error("El nombre de la parte es obligatorio y debe ser una cadena.");
    }

    const todayISO = new Date().toISOString();
    const fecha_actualizacion = getUTCTime(todayISO);

    const updatedParte = await prisma.parte.update({
        where: {
            id_parte: parsedId,
        },
        data: {
            nombre_parte,
            actualizado_en: fecha_actualizacion,
        },
    });

    return updatedParte;
};

// Desactivar una parte (eliminación lógica)
export const deleteParte = async (id_parte) => {
    const parsedId = parseInt(id_parte, 10);
    if (isNaN(parsedId)) {
        throw new Error("El ID proporcionado no es válido.");
    }

    const deletedParte = await prisma.parte.update({
        where: {
            id_parte: parsedId,
        },
        data: {
            estado: false,
            actualizado_en: getUTCTime(new Date().toISOString()),
        },
    });

    return deletedParte;
};
