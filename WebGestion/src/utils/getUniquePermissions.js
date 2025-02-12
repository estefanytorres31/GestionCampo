/**
 * Obtiene un arreglo único de nombres de permisos a partir de los roles del usuario.
 * @param {Array} roles - Arreglo de roles, donde cada rol puede tener una propiedad "permisos" (arreglo de objetos que contienen "nombre").
 * @returns {Array} - Arreglo único de nombres de permisos.
 */
export function getUniquePermissions(roles) {
  const allPermissions =
    roles?.flatMap((role) =>
      Array.isArray(role.permisos)
        ? role.permisos.map((permission) => permission.nombre)
        : []
    ) || [];
  console.log(
    "Array.from(new Set(allPermissions))",
    Array.from(new Set(allPermissions))
  );
  return Array.from(new Set(allPermissions));
}
