import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Asignar un sistema a una embarcación
export const assignSistemaToEmbarcacion = async (id_embarcacion, id_sistema) => {
    if (isNaN(id_embarcacion) || isNaN(id_sistema)) {
        throw new Error("El ID de la embarcación y del sistema deben ser números válidos.");
    }

    // Verificar que la embarcacion existe y está activa
    const embarcacion = await prisma.embarcacion.findUnique({
        where: { id_embarcacion: parseInt(id_embarcacion, 10) },
    });

    if (!embarcacion || !embarcacion.estado) {
        throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
    }

    // Verificar que el sistema existe y está activo
    const sistema = await prisma.sistema.findUnique({
        where: { id_sistema: parseInt(id_sistema, 10) },
    });

    if (!sistema || !sistema.estado) {
        throw new Error(`El sistema con ID ${id_sistema} no existe o está inactivo.`);
    }

    // Verificar si la relación ya existe
    const relacionExistente = await prisma.embarcacionSistema.findUnique({
        where: {
            embarcacion_sistema_unique: {
                id_embarcacion: parseInt(id_embarcacion, 10),
                id_sistema: parseInt(id_sistema, 10),
            },
        },
    });

    if (relacionExistente) {
        if (relacionExistente.estado_sistema) {
            throw new Error("La embarcación ya tiene asignado este sistema y está activo.");
        } else {
            // Reactivar la relación existente
            const relacionReactivada = await prisma.embarcacionSistema.update({
                where: { id_embarcacion_sistema: relacionExistente.id_embarcacion_sistema },
                data: {
                    estado_sistema: true,
                    actualizado_en: new Date(),
                },
            });
            return relacionReactivada;
        }
    }

    // Crear la relación
    const nuevaRelacion = await prisma.embarcacionSistema.create({
        data: {
            id_embarcacion: parseInt(id_embarcacion, 10),
            id_sistema: parseInt(id_sistema, 10),
            estado_sistema: true,
        },
    });

    return nuevaRelacion;
};

// Asignar múltiples sistemas a una embarcación
export const assignMultipleSistemasToEmbarcacion = async (id_embarcacion, sistemas_ids) => {
    if (isNaN(id_embarcacion)) {
        throw new Error("El ID de la embarcación debe ser un número válido.");
    }

    if (!Array.isArray(sistemas_ids) || sistemas_ids.length === 0) {
        throw new Error("Debe proporcionar una lista válida de IDs de sistemas.");
    }

    // Validar que todos los sistemas_ids sean números
    for (const id of sistemas_ids) {
        if (isNaN(id)) {
            throw new Error("Todos los IDs de sistemas deben ser números válidos.");
        }
    }

    // Verificar que la embarcacion existe y está activa
    const embarcacion = await prisma.embarcacion.findUnique({
        where: { id_embarcacion: parseInt(id_embarcacion, 10) },
    });

    if (!embarcacion || !embarcacion.estado) {
        throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
    }

    // Verificar que todos los sistemas existen y están activos
    const sistemas = await prisma.sistema.findMany({
        where: {
            id_sistema: { in: sistemas_ids.map(id => parseInt(id, 10)) },
            estado: true,
        },
    });

    if (sistemas.length !== sistemas_ids.length) {
        throw new Error("Algunos sistemas no existen o están inactivos.");
    }

    // Asignar sistemas usando una transacción
    const resultados = await prisma.$transaction(async (tx) => {
        const operaciones = sistemas_ids.map(async (id_sistema) => {
            const relacionExistente = await tx.embarcacionSistema.findUnique({
                where: {
                    embarcacion_sistema_unique: {
                        id_embarcacion: parseInt(id_embarcacion, 10),
                        id_sistema: parseInt(id_sistema, 10),
                    },
                },
            });

            if (relacionExistente) {
                if (relacionExistente.estado_sistema) {
                    throw new Error(`La embarcación ya tiene asignado el sistema con ID ${id_sistema} y está activo.`);
                } else {
                    // Reactivar la relación existente
                    return tx.embarcacionSistema.update({
                        where: { id_embarcacion_sistema: relacionExistente.id_embarcacion_sistema },
                        data: {
                            estado_sistema: true,
                            actualizado_en: new Date(),
                        },
                    });
                }
            }

            // Crear la relación
            return tx.embarcacionSistema.create({
                data: {
                    id_embarcacion: parseInt(id_embarcacion, 10),
                    id_sistema: parseInt(id_sistema, 10),
                    estado_sistema: true,
                },
            });
        });

        return Promise.all(operaciones);
    });

    return resultados;
};

// Desactivar un sistema de una embarcación
export const deactivateSistemaFromEmbarcacion = async (id_embarcacion, id_sistema) => {
    if (isNaN(id_embarcacion) || isNaN(id_sistema)) {
        throw new Error("El ID de la embarcación y del sistema deben ser números válidos.");
    }

    // Buscar la relación existente
    const relacion = await prisma.embarcacionSistema.findUnique({
        where: {
            embarcacion_sistema_unique: {
                id_embarcacion: parseInt(id_embarcacion, 10),
                id_sistema: parseInt(id_sistema, 10),
            },
        },
    });

    if (!relacion || !relacion.estado_sistema) {
        throw new Error("La relación entre la embarcación y el sistema no existe o ya está desactivada.");
    }

    // Desactivar la relación
    const relacionDesactivada = await prisma.embarcacionSistema.update({
        where: { id_embarcacion_sistema: relacion.id_embarcacion_sistema },
        data: { estado_sistema: false },
    });

    return relacionDesactivada;
};

// Reactivar un sistema previamente desactivado de una embarcación
export const reactivateSistemaFromEmbarcacion = async (id_embarcacion, id_sistema) => {
    if (isNaN(id_embarcacion) || isNaN(id_sistema)) {
        throw new Error("El ID de la embarcación y del sistema deben ser números válidos.");
    }

    // Buscar la relación existente
    const relacion = await prisma.embarcacionSistema.findUnique({
        where: {
            embarcacion_sistema_unique: {
                id_embarcacion: parseInt(id_embarcacion, 10),
                id_sistema: parseInt(id_sistema, 10),
            },
        },
    });

    if (!relacion) {
        throw new Error("La relación entre la embarcación y el sistema no existe.");
    }

    if (relacion.estado_sistema) {
        throw new Error("La relación ya está activa.");
    }

    // Reactivar la relación
    const relacionReactivada = await prisma.embarcacionSistema.update({
        where: { id_embarcacion_sistema: relacion.id_embarcacion_sistema },
        data: { estado_sistema: true },
    });

    return relacionReactivada;
};

// Consultar sistemas activos de una embarcación
export const getActiveSistemasByEmbarcacion = async (id_embarcacion) => {
    if (isNaN(id_embarcacion)) {
        throw new Error("El ID de la embarcación debe ser un número válido.");
    }

    // Verificar que la embarcacion existe y está activa
    const embarcacion = await prisma.embarcacion.findUnique({
        where: { id_embarcacion: parseInt(id_embarcacion, 10) },
    });

    if (!embarcacion || !embarcacion.estado) {
        throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
    }

    const sistemas = await prisma.embarcacionSistema.findMany({
        where: {
            id_embarcacion: parseInt(id_embarcacion, 10),
            estado_sistema: true,
        },
        include: {
            sistema: true,
        },
    });

    if (sistemas.length === 0) {
        throw new Error("No se encontraron sistemas activos para esta embarcación.");
    }

    return sistemas.map(s => s.sistema);
};

// Consultar todas las embarcaciones con sus sistemas activos
export const getAllEmbarcacionesWithSistemas = async () => {
    const embarcaciones = await prisma.embarcacion.findMany({
        where: { estado: true },
        include: {
            embarcacion_sistemas: {
                where: { estado_sistema: true },
                include: {
                    sistema: true,
                },
            },
        },
    });

    if (embarcaciones.length === 0) {
        throw new Error("No hay embarcaciones disponibles.");
    }

    return embarcaciones;
};
