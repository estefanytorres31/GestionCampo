import * as OrdenTrabajoSistemaService from "../services/OrdenTrabajoSistemaService.js";
import { uploadFotos } from "../utils/Cloudinary.js";
import fs from "fs"

/**
 * Crear una OrdenTrabajoSistema
 */
export const createOrdenTrabajoSistema = async (req, res) => {
  try {
    // Se espera que req.body incluya id_orden_trabajo e id_embarcacion_sistema
    const orden = await OrdenTrabajoSistemaService.createOrdenTrabajoSistema(req.body);
    
    // Determinar si se creó o se reactivó (comparando timestamps)
    const mensaje = orden.creado_en.getTime() === orden.actualizado_en.getTime()
      ? "Orden de trabajo creada exitosamente."
      : "Orden de trabajo reactivada exitosamente.";

    res.status(201).json({ message: mensaje, data: orden });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtener todas las órdenes de trabajo activas
 */
export const getAllOrdenesTrabajoSistema = async (req, res) => {
  try {
    const ordenes = await OrdenTrabajoSistemaService.getAllOrdenesTrabajoSistema();
    res.status(200).json({ message: "Órdenes de trabajo obtenidas exitosamente.", data: ordenes });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Obtener los sistemas y partes de una Orden de Trabajo por ID
 */
export const getSistemasYPartesPorOrdenTrabajo = async (req, res) => {
  const { id_orden_trabajo } = req.params;

  try {
    const resultado = await OrdenTrabajoSistemaService.getSistemasYPartesPorOrdenTrabajo(id_orden_trabajo);
    res.status(200).json({ message: "Sistemas y partes obtenidos exitosamente.", data: resultado });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Obtener una OrdenTrabajoSistema por ID
 */
export const getOrdenTrabajoSistemaById = async (req, res) => {
  const { id } = req.params;

  try {
    const orden = await OrdenTrabajoSistemaService.getOrdenTrabajoSistemaById(id);
    res.status(200).json({ message: "Orden de trabajo obtenida exitosamente.", data: orden });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Actualizar una OrdenTrabajoSistema
 */
export const updateOrdenTrabajoSistema = async (req, res) => {
  const { id } = req.params;
  try {
    let nuevasFotos = [];
    
    // Manejar archivos de imagen
    if (req.files) {
      // Si es un solo archivo
      if (req.files.imagen) {
        const uploadResult = await uploadFotos(req.files.imagen.tempFilePath);
        nuevasFotos.push(uploadResult.secure_url);
      }
      
      // Si son múltiples archivos
      if (req.files.imagenes) {
        const imagenes = Array.isArray(req.files.imagenes) 
          ? req.files.imagenes 
          : [req.files.imagenes];
        
        for (const imagen of imagenes) {
          const uploadResult = await uploadFotos(imagen.tempFilePath);
          nuevasFotos.push(uploadResult.secure_url);
        }
      }
    }

    // Preparar body con las fotos
    const bodyConFotos = {
      ...req.body,
      fotos: nuevasFotos
    };

    const orden = await OrdenTrabajoSistemaService.updateOrdenTrabajoSistema(id, bodyConFotos);

    // Limpiar archivos temporales
    if (req.files) {
      if (req.files.imagen) {
        fs.unlinkSync(req.files.imagen.tempFilePath);
      }
      if (req.files.imagenes) {
        const imagenes = Array.isArray(req.files.imagenes) 
          ? req.files.imagenes 
          : [req.files.imagenes];
        imagenes.forEach(imagen => fs.unlinkSync(imagen.tempFilePath));
      }
    }

    res.status(200).json({ 
      message: "Orden de trabajo actualizada exitosamente.", 
      data: orden,
    });
  } catch (error) {
    console.error('Error en updateOrdenTrabajoSistema:', error);
    
    // Limpiar archivos temporales en caso de error
    if (req.files) {
      if (req.files.imagen) {
        fs.unlinkSync(req.files.imagen.tempFilePath);
      }
      if (req.files.imagenes) {
        const imagenes = Array.isArray(req.files.imagenes) 
          ? req.files.imagenes 
          : [req.files.imagenes];
        imagenes.forEach(imagen => fs.unlinkSync(imagen.tempFilePath));
      }
    }

    res.status(400).json({ 
      message: error.message,
      error: error.stack // Agregado para debug
    });
  }
};

/**
 * Desactivar una OrdenTrabajoSistema
 */
export const deleteOrdenTrabajoSistema = async (req, res) => {
  const { id } = req.params;

  try {
    const orden = await OrdenTrabajoSistemaService.deleteOrdenTrabajoSistema(id);
    res.status(200).json({ message: "Orden de trabajo desactivada exitosamente.", data: orden });
  } catch (error) {
    if (error.message.includes("no existe") || error.message.includes("inactiva")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateEstadoOrdenTrabajoSistema=async(req, res)=>{
  const { id } = req.params;
  const { estado } = req.body;
  try{
    const orden = await OrdenTrabajoSistemaService.updateEstadoOrdenTrabajoSistema(id, estado);
    res.status(200).json({ message: `Estado de orden de trabajo sistema actualizado exitosamente.`, data: orden });
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
