import axiosInstance from "@/config/axiosConfig";

/**
 * Actualiza la entrada "roles" en el localStorage obteniendo para cada rol
 * sus permisos desde el endpoint correspondiente.
 * Se espera que cada rol en selectedRoles tenga al menos las propiedades: id y nombre.
 * 
 * @param {Array} selectedRoles - Array de roles seleccionados, por ejemplo: [{ id: 1, nombre: "Administrador", ... }, ...]
 * @param {Function} refreshUsuario - Función para refrescar el contexto del usuario.
 * @returns {Promise<void>}
 */
export const updateLocalStorageRolesFromSelectedRoles = async (selectedRoles, refreshUsuario) => {
  try {
    const rolesConPermisos = await Promise.all(
      selectedRoles.map(async (rol) => {
        try {
          // Obtener los permisos para este rol
          const response = await axiosInstance.get(`/rolespermisos/permisos/${rol.id}`);
          const permisosResponse = response.data;
          // Si existe una propiedad data que sea un array, la usamos; si no, asignamos un array vacío.
          const permisosArray = Array.isArray(permisosResponse.data) ? permisosResponse.data : [];
          // Mapear para obtener solo los campos necesarios
          const permisosModificados = permisosArray.map((permiso) => ({
            id: permiso.id,
            nombre: permiso.nombre,
            key: permiso.key,
          }));
          // Retornamos el rol extendido con su lista de permisos
          return { ...rol, permisos: permisosModificados };
        } catch (error) {
          console.error(`Error obteniendo permisos para el rol ${rol.id}:`, error.message);
          return rol; // Si falla, retornamos el rol sin permisos
        }
      })
    );
    localStorage.setItem("roles", JSON.stringify(rolesConPermisos));
    refreshUsuario();
  } catch (error) {
    console.error("Error actualizando roles en localStorage:", error.message);
  }
};
