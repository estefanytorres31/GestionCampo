import {v2 as cloudinary} from 'cloudinary';
import path from 'path';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  export async function uploadQR(filePath, nombre) {
    try {
        return await cloudinary.uploader.upload(filePath, {
            folder: 'qr_embarcaciones',
            public_id: `${nombre}_QR`,
            transformation: [
                { quality: 'auto:best' },
                { fetch_format: 'auto' }
            ]
        });
    } catch (error) {
        console.error('Error en uploadQR:', error);
        throw new Error("Error al subir el QR a Cloudinary");
    }
}

/**
 * Subir foto a Cloudinary
 * @param {string} filePath - Ruta local del archivo a subir
 * @returns {Promise<object>} - Información de la imagen subida
 */
export async function uploadFotos(filePath) {
  try {
      const result = await cloudinary.uploader.upload(filePath, {
          folder: 'fotos',
          transformation: [
              { quality: 'auto:best' },
              { fetch_format: 'auto' }
          ]
      });
      return result;
  } catch (error) {
      console.error('Error en uploadFotos:', error);
      throw new Error("Error al subir la foto a Cloudinary");
  }
}

/**
 * Eliminar imagen de Cloudinary
 * @param {string} secureUrl - URL segura de la imagen en Cloudinary
 * @returns {Promise<object>} - Resultado de la eliminación
 */
export async function deleteImage(secureUrl) {
  try {
      // Extraer el public_id correcto
      const urlParts = new URL(secureUrl).pathname.split('/');
      const fileNameWithExtension = urlParts[urlParts.length - 1];  // Obtener "nombre.extension"
      const folderName = urlParts[urlParts.length - 2]; // Obtener "fotos" o la carpeta usada
      const publicId = `${folderName}/${fileNameWithExtension.split('.')[0]}`;

      const result = await cloudinary.uploader.destroy(publicId);
      return result;
  } catch (error) {
      console.error('Error en deleteImage:', error);
      throw new Error("Error al eliminar la imagen en Cloudinary");
  }
}

