import * as AccionService from "../services/AccionService.js";

export const seedAcciones = async (req, res) => {
  try {
    // Array de acciones a sembrar
    const accionesArray = [
      { key: "CREAR", nombre: "Crear", descripcion: "Permite crear registros" },
      { key: "LEER", nombre: "Leer", descripcion: "Permite leer registros" },
      { key: "EDITAR", nombre: "Editar", descripcion: "Permite editar registros" },
      { key: "ELIMINAR", nombre: "Eliminar", descripcion: "Permite eliminar registros" },
      { key: "BUSCAR", nombre: "Buscar", descripcion: "Permite buscar registros" }
    ];

    const results = [];

    // Iterar sobre el arreglo y crear o reactivar cada acción
    for (const accion of accionesArray) {
      try {
        // Llamamos a la función de servicio, pasando key, nombre y descripción
        const newAccion = await AccionService.createAccion(
          accion.key,
          accion.nombre,
          accion.descripcion
        );
        results.push(newAccion);
      } catch (error) {
        // Si ocurre un error (por ejemplo, si la acción ya existe y está activa),
        // se muestra en la consola y se continúa con la siguiente.
        console.error(`Error creando la acción "${accion.nombre}":`, error.message);
      }
    }

    res.status(200).json({
      message: "Acciones sembradas exitosamente.",
      data: results,
    });
  } catch (error) {
    console.error("Error en seedAcciones:", error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * Crear o reactivar una acción.
 */
export const createAccion = async (req, res) => {
  const { key, nombre, descripcion } = req.body;
  try {
    const accion = await AccionService.createAccion(key, nombre, descripcion);
    const mensaje = accion.creado_en.getTime() === accion.actualizado_en.getTime()
      ? "Acción creada exitosamente."
      : "Acción reactivada exitosamente.";
    res.status(201).json({ message: mensaje, data: accion });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Obtener todas las acciones activas.
 */
export const getAllAcciones = async (req, res) => {
  try {
    const acciones = await AccionService.getAllAcciones();
    res.status(200).json({ message: "Acciones obtenidas exitosamente.", data: acciones });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Obtener una acción por su ID.
 */
export const getAccionById = async (req, res) => {
  const { id } = req.params;
  try {
    const accion = await AccionService.getAccionById(id);
    res.status(200).json({ message: "Acción obtenida exitosamente.", data: accion });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Actualizar una acción existente.
 */
export const updateAccion = async (req, res) => {
  const { id } = req.params;
  const { key, nombre, descripcion } = req.body;
  try {
    const accionActualizada = await AccionService.updateAccion(id, key, nombre, descripcion);
    res.status(200).json({ message: "Acción actualizada exitosamente.", data: accionActualizada });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Desactivar (eliminar lógicamente) una acción.
 */
export const deleteAccion = async (req, res) => {
  const { id } = req.params;
  try {
    const accionDesactivada = await AccionService.deleteAccion(id);
    res.status(200).json({ message: "Acción desactivada exitosamente.", data: accionDesactivada });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
