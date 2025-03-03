import * as RecursoService from "../services/RecursoService.js";

export const seedResources = async (req, res) => {
  try {
    const resourcesArray = [
      {
        "resourceKey": "dashboard",
        "nombre": "Dashboard",
        "descripcion": "Sección del dashboard principal"
      },
      {
        "resourceKey": "asistencias",
        "nombre": "Asistencias",
        "descripcion": "Sección para la gestión de asistencias"
      },
      {
        "resourceKey": "trabajos_asignados",
        "nombre": "Trabajos Asignados",
        "descripcion": "Sección para ver los trabajos asignados"
      },
      {
        "resourceKey": "usuarios",
        "nombre": "Usuarios",
        "descripcion": "Sección para administrar usuarios"
      },
      {
        "resourceKey": "roles",
        "nombre": "Roles",
        "descripcion": "Sección para administrar roles"
      },
      {
        "resourceKey": "permisos",
        "nombre": "Permisos",
        "descripcion": "Sección para administrar permisos"
      }
    ];
    
    const results = [];
    
    // Iterar por cada registro y crear o reactivar el recurso
    for (const resource of resourcesArray) {
      try {
        // Llamamos a la función de servicio directamente, pasando los parámetros.
        const newResource = await RecursoService.createRecurso(
          resource.nombre,
          resource.descripcion
        );
        results.push(newResource);
      } catch (error) {
        // Se captura el error (por ejemplo, si el recurso ya existe y está activo)
        console.error(`Error creando el recurso "${resource.nombre}":`, error.message);
        // Puedes optar por continuar o detener el loop según lo que necesites.
      }
    }

    res.status(200).json({
      message: "Recursos sembrados exitosamente.",
      data: results,
    });
  } catch (error) {
    console.error("Error en seedResources:", error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * Crear o reactivar un recurso.
 */
export const createRecurso = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const recurso = await RecursoService.createRecurso(nombre, descripcion);
    // Si la fecha de creación y actualización son iguales se creó; de lo contrario se reactivó.
    const mensaje = recurso.creado_en.getTime() === recurso.actualizado_en.getTime()
      ? "Recurso creado exitosamente."
      : "Recurso reactivado exitosamente.";

    res.status(201).json({ message: mensaje, data: recurso });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Obtener todos los recursos activos, con la posibilidad de filtrar por 'incompleto'.
 */
export const getAllRecursosController = async (req, res) => {
  try {
    const filters = {
      incompleto: req.query.incompleto || undefined, // Ej: ?incompleto=true
    };

    const recursos = await RecursoService.getAllRecursos(filters);

    res.status(200).json({
      message: "Recursos obtenidos exitosamente.",
      data: recursos,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Obtener un recurso por su ID.
 */
export const getRecursoById = async (req, res) => {
  const { id } = req.params;

  try {
    const recurso = await RecursoService.getRecursoById(id);
    res.status(200).json({ message: "Recurso obtenido exitosamente.", data: recurso });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Actualizar un recurso existente.
 */
export const updateRecurso = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const recursoActualizado = await RecursoService.updateRecurso(id, nombre, descripcion);
    res.status(200).json({ message: "Recurso actualizado exitosamente.", data: recursoActualizado });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Desactivar (eliminar lógicamente) un recurso.
 */
export const deleteRecurso = async (req, res) => {
  const { id } = req.params;

  try {
    const recursoDesactivado = await RecursoService.deleteRecurso(id);
    res.status(200).json({ message: "Recurso desactivado exitosamente.", data: recursoDesactivado });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
