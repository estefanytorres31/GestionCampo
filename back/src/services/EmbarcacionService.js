import { getPeruTime, getUTCTime } from "../utils/Time.js";
import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";
import fs from 'fs-extra';  // Importa fs-extra en lugar de fs
import path from "path";
import sharp from "sharp";
import { uploadQR } from "../utils/Cloudinary.js";


const prisma = new PrismaClient();

/**
 * Crea una nueva embarcación.
 * @param {string} identificadorBarco - Identificador único del barco.
 * @param {string} nombre - Nombre de la embarcación.
 * @param {string} datosQrCode - Datos del QR Code.
 * @param {string} [ubicacion] - Ubicación actual de la embarcación.
 * @param {number} puertoId - ID del puerto actual.
 * @param {number} empresaId - ID de la empresa propietaria.
 * @returns {Promise<Object>} - La embarcación creada.
 */
export const createEmbarcacion = async (nombre, empresa_id) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = new Date(todayISO);

  // Verificar si la empresa existe y está activa
  console.log('empresa_id:', empresa_id);
  const empresa = await prisma.empresa.findUnique({
    where: { 
      id: parseInt(empresa_id, 10)
    },
  });

  if (!empresa || !empresa.estado) {
    throw new Error("La empresa no existe o está inactiva.");
  }

  try {
    // Crear directorio temporal si no existe
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.ensureDir(tempDir);

    // Generar QR
    const qrData = `Embarcación: ${nombre} | Empresa: ${empresa.nombre}`;
    const qrPath = path.join(tempDir, `${nombre}_qr_temp.png`);
    await QRCode.toFile(qrPath, qrData, {
      width: 400,
      margin: 1
    });

    // Crear imagen con QR y texto usando Sharp
    const finalImagePath = path.join(tempDir, `${nombre}_qr_final.png`);
    await sharp(qrPath)
    .resize(400, 400) // Aseguramos que el QR tenga un tamaño adecuado
    .extend({
      top: 0,
      bottom: 120, // Espacio adicional debajo de la imagen para el texto
      background: { r: 255, g: 255, b: 255 } // Fondo blanco
    })
    .composite([{
      input: Buffer.from(`
        <svg width="400" height="120">
          <text x="50%" y="20" font-family="Arial" font-size="18" fill="black" text-anchor="middle">
            Empresa: ${empresa.nombre}
          </text>
          <text x="50%" y="50" font-family="Arial" font-size="18" fill="black" text-anchor="middle">
            Embarcación: ${nombre}
          </text>
        </svg>
      `),
      top: 400, // Colocamos el texto debajo de la imagen QR
      left: 0
    }])
    .toFile(finalImagePath);

    // Subir a Cloudinary
    const cloudinaryResult = await uploadQR(finalImagePath, nombre);

    // Crear la embarcación en la base de datos
    const embarcacion = await prisma.embarcacion.create({
      data: {
        nombre,
        qr_code: cloudinaryResult.secure_url,
        empresa_id,
        creado_en: fecha_creacion,
        actualizado_en: fecha_creacion,
      },
    });

    // Limpiar archivos temporales
    await fs.remove(qrPath);
    await fs.remove(finalImagePath);

    return embarcacion;
  } catch (error) {
    console.error('Error en createEmbarcacion:', error);
    throw new Error("Error al crear la embarcación: " + error.message);
  }
};

/**
 * Obtiene todas las embarcaciones activas.
 * @returns {Promise<Array>} - Lista de embarcaciones.
 */
export const getAllEmbarcaciones = async () => {
  const embarcaciones = await prisma.embarcacion.findMany({
    where: { estado: true },
    include: {
      empresa: true,
    },
    orderBy: { nombre: "asc" },
  });
  return embarcaciones;
};

/**
 * Obtiene una embarcación por su ID.
 * @param {number} id - ID de la embarcación.
 * @returns {Promise<Object>} - La embarcación encontrada.
 */
export const getEmbarcacionById = async (id) => {
  const embarcacion = await prisma.embarcacion.findUnique({
    where: { id_embarcacion: parseInt(id) },
    include: {
      puerto: true,
      empresa: true,
    },
  });

  if (!embarcacion) {
    throw new Error("La embarcación no existe.");
  }

  return embarcacion;
};

/**
 * Actualiza una embarcación existente.
 * @param {number} id - ID de la embarcación a actualizar.
 * @param {string} [nombre] - Nuevo nombre de la embarcación.
 * @param {string} [ubicacion] - Nueva ubicación de la embarcación.
 * @param {number} [puertoId] - Nuevo ID del puerto.
 * @param {number} [empresaId] - Nuevo ID de la empresa propietaria.
 * @returns {Promise<Object>} - La embarcación actualizada.
 */
export const updateEmbarcacion = async (id, nombre, ubicacion, puertoId, empresaId) => {
  const todayISO = new Date().toISOString();
  const fecha_creacion = getUTCTime(todayISO);
  // Verificar si la embarcación existe
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { id_embarcacion: parseInt(id) },
  });

  if (!embarcacionExistente) {
    throw new Error("La embarcación no existe.");
  }

  // Verificar si el nuevo puerto existe y está activo
  if (puertoId) {
    const puerto = await prisma.puerto.findUnique({ where: { id: puertoId } });
    if (!puerto || !puerto.estado) {
      throw new Error("El puerto no existe o está inactivo.");
    }
  }

  // Verificar si la nueva empresa existe y está activa
  if (empresaId) {
    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa || !empresa.estado) {
      throw new Error("La empresa no existe o está inactiva.");
    }
  }

  // Actualizar la embarcación
  const embarcacionActualizada = await prisma.embarcacion.update({
    where: { id_embarcacion: parseInt(id) },
    data: {
      nombre: nombre || embarcacionExistente.nombre,
      ubicacion: ubicacion || embarcacionExistente.ubicacion,
      empresa_id: empresaId || embarcacionExistente.empresa_id,
      actualizado_en: fecha_creacion,
    },
  });

  return embarcacionActualizada;
};

/**
 * Desactiva una embarcación (soft delete).
 * @param {number} id - ID de la embarcación a desactivar.
 * @returns {Promise<void>}
 */
export const deleteEmbarcacion = async (id) => {
  const embarcacionExistente = await prisma.embarcacion.findUnique({
    where: { id_embarcacion: parseInt(id) },
  });

  if (!embarcacionExistente) {
    throw new Error("La embarcación no existe.");
  }

  // Realizar un soft delete (desactivar la embarcación)
  await prisma.embarcacion.update({
    where: { id_embarcacion: parseInt(id) },
    data: { estado: false },
  });
};


export const getEmbarcacionByEmpresa=async(empresa_id)=>{
  const embarcaciones=await prisma.embarcacion.findMany({
    where:{
      empresa_id:parseInt(empresa_id),
      estado:true
    },
    include:{
      empresa:true
    }
  })
  return embarcaciones;
}