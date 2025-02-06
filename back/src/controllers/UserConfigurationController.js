import * as UserConfigurationService from "../services/UserConfigurationService.js";

/**
 * Endpoint para crear o actualizar la configuración de tema de un usuario.
 */
export const setUserTheme = async (req, res) => {
  console.log("req", req.body);
  const { usuarioId, configuracion, valor } = req.body;

  // Verificamos que se envíen usuarioId y un valor (el tema) y que la configuración sea "theme"
  if (!usuarioId || !valor || configuracion !== "theme") {
    return res
      .status(400)
      .json({ message: "usuarioId y theme son requeridos." });
  }

  try {
    const config = await UserConfigurationService.setUserTheme(
      Number(usuarioId),
      valor
    );
    res
      .status(200)
      .json({ message: "Tema actualizado exitosamente.", data: config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Endpoint para obtener la configuración de tema de un usuario.
 */
export const getUserTheme = async (req, res) => {
  const { usuarioId } = req.params;
  if (!usuarioId) {
    return res.status(400).json({ message: "usuarioId es requerido." });
  }
  try {
    const config = await UserConfigurationService.getUserTheme(
      Number(usuarioId)
    );
    if (!config) {
      return res
        .status(404)
        .json({ message: "No se encontró configuración para el usuario." });
    }
    res
      .status(200)
      .json({ message: "Configuración obtenida exitosamente.", data: config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
