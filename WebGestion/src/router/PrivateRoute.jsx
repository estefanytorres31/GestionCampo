// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import roleMapper from "@/utils/roleMapper"; // Ajusta la ruta a donde esté tu función roleMapper

// /**
//  * PrivateRoute es un componente que protege rutas según roles autorizados.
//  * @param {Object} props
//  * @param {React.ComponentType} props.element - Componente a renderizar si se cumple la autorización.
//  * @param {string[]} props.authorizedRoles - Array de roles autorizados (por ejemplo: ["administrador", "jefe"]).
//  * @returns {JSX.Element}
//  */
// const PrivateRoute = ({ element: Component, authorizedRoles }) => {
//   const { usuario } = useAuth();

//   // Si no hay usuario autenticado, redirige a login
//   if (!usuario) {
//     return <Navigate to="/login" replace />;
//   }

//   // Obtener roles del usuario: suponemos que usuario.roles es un array; si no lo es, lo convertimos a array.
//   const userRoles = Array.isArray(usuario.roles) ? usuario.roles : [usuario.rol];

//   // Mapea los roles del usuario (por ejemplo, para normalizarlos a minúsculas o según lógica de roleMapper)
//   const mappedUserRoles = userRoles.map((role) => roleMapper(role).toLowerCase());

//   // Convertir los roles autorizados a minúsculas para la comparación (o aplica el mapeo según corresponda)
//   const normalizedAuthorizedRoles = authorizedRoles.map((rol) => rol.toLowerCase());

//   // Verifica si el usuario tiene al menos uno de los roles autorizados
//   const isAuthorized = mappedUserRoles.some((rol) =>
//     normalizedAuthorizedRoles.includes(rol)
//   );

//   console.log("isAuthorized", isAuthorized);
//   console.log("usuario", usuario);
//   console.log("userRoles", userRoles);
//   console.log("mappedUserRoles", mappedUserRoles);
//   console.log("normalizedAuthorizedRoles", normalizedAuthorizedRoles);
//   console.log("authorizedRoles", authorizedRoles);

//   return isAuthorized ? (
//     <Component />
//   ) : (
//     <Navigate to="/access-denied" replace />
//   );
// };

// export default PrivateRoute;
