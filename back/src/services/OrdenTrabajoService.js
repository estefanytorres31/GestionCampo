import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Asignar un Trabajo a una Embarcación
export const asignarTrabajoAEmbarcacion = async ({
    id_tipo_trabajo,
    id_embarcacion,
    id_puerto,
    id_jefe_asigna,
    comentarios,
}) => {
    // Validaciones básicas
    if (isNaN(id_tipo_trabajo) || isNaN(id_embarcacion) || isNaN(id_puerto) || isNaN(id_jefe_asigna)) {
        throw new Error("Todos los IDs proporcionados deben ser números válidos.");
    }

    // Verificar que el TipoTrabajo exista y esté activo
    const tipoTrabajo = await prisma.tipoTrabajo.findUnique({
        where: { id_tipo_trabajo },
    });

    if (!tipoTrabajo || !tipoTrabajo.estado) {
        throw new Error(`El tipo de trabajo con ID ${id_tipo_trabajo} no existe o está inactivo.`);
    }

    // Verificar que la Embarcacion exista y esté activa
    const embarcacion = await prisma.embarcacion.findUnique({
        where: { id_embarcacion },
    });

    if (!embarcacion || !embarcacion.estado) {
        throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
    }

    // Verificar que el Puerto exista y esté activo
    const puerto = await prisma.puerto.findUnique({
        where: { id_puerto },
    });

    if (!puerto || !puerto.estado) {
        throw new Error(`El puerto con ID ${id_puerto} no existe o está inactivo.`);
    }

    // Verificar que el Usuario (Jefe que asigna) exista y tenga el rol adecuado
    const jefe = await prisma.usuario.findUnique({
        where: { id: id_jefe_asigna },
    });

    if (!jefe || !jefe.estado) {
        throw new Error(`El usuario con ID ${id_jefe_asigna} no existe o está inactivo.`);
    }

    // Crear la Orden de Trabajo
    const ordenTrabajo = await prisma.ordenTrabajo.create({
        data: {
            id_tipo_trabajo,
            id_embarcacion,
            id_puerto,
            id_jefe_asigna,
            fecha_asignacion: new Date(),
            estado: "pendiente",
            comentarios,
        },
    });

    return ordenTrabajo;
};

// Gestionar el Estado de la Orden de Trabajo
export const gestionarEstadoOrdenTrabajo = async (id_orden_trabajo, nuevo_estado) => {
    const validEstados = ["pendiente", "en_progreso", "completado", "cancelado"];
    if (!validEstados.includes(nuevo_estado)) {
        throw new Error(`El estado "${nuevo_estado}" no es válido. Estados permitidos: ${validEstados.join(", ")}.`);
    }

    // Verificar que la Orden de Trabajo exista
    const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
        where: { id_orden_trabajo },
    });

    if (!ordenTrabajo) {
        throw new Error(`La orden de trabajo con ID ${id_orden_trabajo} no existe.`);
    }

    // Actualizar el estado
    const ordenTrabajoActualizada = await prisma.ordenTrabajo.update({
        where: { id_orden_trabajo },
        data: { estado: nuevo_estado, actualizado_en: new Date() },
    });

    return ordenTrabajoActualizada;
};

// Actualizar el Estado de la Orden de Trabajo
export const actualizarEstadoOrdenTrabajo = async (id_orden_trabajo, nuevo_estado) => {
    // Este método puede reutilizarse con gestionarEstadoOrdenTrabajo
    return await gestionarEstadoOrdenTrabajo(id_orden_trabajo, nuevo_estado);
};

// Asignar múltiples Ordenes de Trabajo a una Embarcación (Transacción)
export const asignarMultipleOrdenesTrabajoAEmbarcacion = async (ordenes) => {
    /*
        'ordenes' es un array de objetos que contienen:
        - id_tipo_trabajo
        - id_embarcacion
        - id_puerto
        - id_jefe_asigna
        - comentarios
    */

    if (!Array.isArray(ordenes) || ordenes.length === 0) {
        throw new Error("Debe proporcionar una lista válida de órdenes de trabajo.");
    }

    // Iniciar una transacción
    const resultados = await prisma.$transaction(async (tx) => {
        const operaciones = ordenes.map(async (orden) => {
            const {
                id_tipo_trabajo,
                id_embarcacion,
                id_puerto,
                id_jefe_asigna,
                comentarios,
            } = orden;

            // Validaciones similares a asignarTrabajoAEmbarcacion
            if (
                isNaN(id_tipo_trabajo) ||
                isNaN(id_embarcacion) ||
                isNaN(id_puerto) ||
                isNaN(id_jefe_asigna)
            ) {
                throw new Error("Todos los IDs proporcionados deben ser números válidos.");
            }

            const tipoTrabajo = await tx.tipoTrabajo.findUnique({
                where: { id_tipo_trabajo },
            });

            if (!tipoTrabajo || !tipoTrabajo.estado) {
                throw new Error(`El tipo de trabajo con ID ${id_tipo_trabajo} no existe o está inactivo.`);
            }

            const embarcacion = await tx.embarcacion.findUnique({
                where: { id_embarcacion },
            });

            if (!embarcacion || !embarcacion.estado) {
                throw new Error(`La embarcación con ID ${id_embarcacion} no existe o está inactiva.`);
            }

            const puerto = await tx.puerto.findUnique({
                where: { id_puerto },
            });

            if (!puerto || !puerto.estado) {
                throw new Error(`El puerto con ID ${id_puerto} no existe o está inactivo.`);
            }

            const jefe = await tx.usuario.findUnique({
                where: { id: id_jefe_asigna },
            });

            if (!jefe || !jefe.estado) {
                throw new Error(`El usuario con ID ${id_jefe_asigna} no existe o está inactivo.`);
            }

            // Crear la Orden de Trabajo
            return await tx.ordenTrabajo.create({
                data: {
                    id_tipo_trabajo,
                    id_embarcacion,
                    id_puerto,
                    id_jefe_asigna,
                    fecha_asignacion: new Date(),
                    estado: "pendiente",
                    comentarios,
                },
            });
        });

        return Promise.all(operaciones);
    });

    return resultados;
};