import { PrismaClient } from "@prisma/client";
import { getUTCTime } from "../utils/Time.js";

const prisma = new PrismaClient();

/**
 * Crea o reactiva una nueva empresa.
 * @param {string} nombre - Nombre de la empresa.
 * @returns {Promise<Object>} - La empresa creada o reactivada.
 */
export const createEmpresa = async (nombre) => {
    if (!nombre) {
        throw new Error("El nombre de la empresa es obligatorio.");
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    // Verificar si la empresa ya existe (incluyendo las inactivas)
    const empresaExistente = await prisma.empresa.findUnique({
        where: { nombre },
    });

    if (empresaExistente) {
        if (empresaExistente.estado) {
            throw new Error(`La empresa con el nombre "${nombre}" ya existe y está activa.`);
        } else {
            // Reactivar la empresa inactiva
            const empresaReactivada = await prisma.empresa.update({
                where: { id: empresaExistente.id },
                data: {
                    estado: true,
                    actualizado_en: fechaActual,
                },
            });

            return empresaReactivada;
        }
    }

    // Crear nueva empresa si no existe
    const nuevaEmpresa = await prisma.empresa.create({
        data: {
            nombre,
            estado: true, // Asegurarse de que la empresa se cree activa
            creado_en: fechaActual,
            actualizado_en: fechaActual,
        },
    });

    return nuevaEmpresa;
};

/**
 * Obtiene todas las empresas activas.
 * @returns {Promise<Array>} - Lista de empresas.
 */
export const getAllEmpresas = async () => {
    const empresas = await prisma.empresa.findMany({
        where: { estado: true },
        orderBy: { creado_en: "desc" },
    });

    if (empresas.length === 0) {
        throw new Error("No hay empresas disponibles.");
    }

    return empresas;
};

/**
 * Obtiene una empresa por su ID.
 * @param {number} id - ID de la empresa.
 * @returns {Promise<Object>} - La empresa encontrada.
 */
export const getEmpresaById = async (id) => {
    if (!id) {
        throw new Error("El ID de la empresa es obligatorio.");
    }

    const empresa = await prisma.empresa.findUnique({
        where: { id: parseInt(id, 10) },
    });

    if (!empresa || !empresa.estado) {
        throw new Error(`La empresa con ID ${id} no existe o está inactiva.`);
    }

    return empresa;
};

/**
 * Actualiza una empresa existente.
 * @param {number} id - ID de la empresa a actualizar.
 * @param {string} nombre - Nuevo nombre de la empresa.
 * @returns {Promise<Object>} - La empresa actualizada.
 */
export const updateEmpresa = async (id, nombre) => {
    if (!id || !nombre) {
        throw new Error("El ID y el nombre de la empresa son obligatorios.");
    }

    // Verificar si otra empresa con el mismo nombre ya está activa
    const otraEmpresa = await prisma.empresa.findUnique({
        where: { nombre },
    });

    if (otraEmpresa && otraEmpresa.id !== parseInt(id, 10) && otraEmpresa.estado) {
        throw new Error(`Otra empresa con el nombre "${nombre}" ya existe y está activa.`);
    }

    const fechaActualizacion = getUTCTime(new Date().toISOString());

    const empresaActualizada = await prisma.empresa.update({
        where: { id: parseInt(id, 10) },
        data: {
            nombre,
            actualizado_en: fechaActualizacion,
        },
    });

    return empresaActualizada;
};

/**
 * Desactiva una empresa (soft delete).
 * @param {number} id - ID de la empresa a desactivar.
 * @returns {Promise<Object>} - La empresa desactivada.
 */
export const deleteEmpresa = async (id) => {
    if (!id) {
        throw new Error("El ID de la empresa es obligatorio.");
    }

    const empresa = await prisma.empresa.findUnique({
        where: { id: parseInt(id, 10) },
    });

    if (!empresa || !empresa.estado) {
        throw new Error(`La empresa con ID ${id} no existe o ya está inactiva.`);
    }

    const fechaActual = getUTCTime(new Date().toISOString());

    const empresaDesactivada = await prisma.empresa.update({
        where: { id: parseInt(id, 10) },
        data: { estado: false, actualizado_en: fechaActual },
    });

    return empresaDesactivada;
};
