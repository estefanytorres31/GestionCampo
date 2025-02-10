import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext"; // Asegúrate de que ThemeProvider envuelva a AuthProvider
import useFetchData from "@/hooks/useFetchData";
import axiosInstance from "@/config/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setSpecificTheme } = useTheme(); // Extraemos la función para actualizar el tema
  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");
    return (
      token &&
      expiration &&
      new Date().getTime() < new Date(expiration).getTime()
    );
  });

  const [usuario, setUsuario] = useState(() => {
    const storedUser = localStorage.getItem("usuario");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      return null;
    }
  });

  const [roles, setRoles] = useState(() => {
    const storedRoles = localStorage.getItem("roles");
    try {
      return storedRoles ? JSON.parse(storedRoles) : [];
    } catch (error) {
      console.error("Error al parsear roles:", error);
      return [];
    }
  });

  // const permisosPorRol = (id) => {

  //   const permisos = await

  //   const {
  //     data: assignedData,
  //     loading: loadingAssigned,
  //     error: errorAssignedRaw,
  //     refetch: refetchAssigned,
  //   } = useFetchData(`/rolespermisos/permisos/${id}`, {}, 1, 100);

  //   await Promiso.all(

  //   )

  // }

  useEffect(() => {
    if (!isAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("usuario");
      // Opcionalmente, se puede remover el tema
      // localStorage.removeItem("theme");
      setUsuario(null);
      setRoles([]);
    }
  }, [isAuth]);

  const login = async (data) => {
    const {
      token,
      expiracion,
      userId,
      nombreUsuario,
      nombreCompleto,
      rolesPorId,
      theme,
    } = data;

    try {
      const rolesConPermisos = await Promise.all(
        rolesPorId.map(async (rol) => {
          // Realiza la petición para obtener los permisos del rol
          const response = await axiosInstance.get(`/rolespermisos/permisos/${rol.id}`);
          const permisosResponse = response.data;
    
          const permisosArray = Array.isArray(permisosResponse.data) ? permisosResponse.data : [];
          
          // Mapea cada permiso para obtener solo el id y nombre
          const permisosModificados = permisosArray.map((permiso) => ({
            id: permiso.id,
            nombre: permiso.nombre
          }));
    
          // Retorna el rol extendido con la propiedad 'permisos'
          return { ...rol, permisos: permisosModificados };
        })
      );

      // Arma el objeto usuario que se almacenará en localStorage y en el estado
      const usuarioData = {
        userId,
        nombreUsuario,
        nombreCompleto,
        theme,
      };

      // Guarda en localStorage la información del usuario, token y roles con permisos
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expiracion);
      localStorage.setItem("usuario", JSON.stringify(usuarioData));
      localStorage.setItem("roles", JSON.stringify(rolesConPermisos));
      if (theme) localStorage.setItem("theme", theme);

      // Actualiza el estado del contexto
      setUsuario(usuarioData);
      setRoles(rolesConPermisos);
      setIsAuth(true);
      if (theme) setSpecificTheme(theme);
    } catch (error) {
      console.error("Error al obtener permisos por rol:", error);
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje o tomando otra acción.
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("usuario");
    localStorage.removeItem("roles");
    // Opcionalmente, se puede limpiar el tema o dejarlo para el siguiente usuario
    // localStorage.removeItem("theme");
    setUsuario(null);
    setRoles([]);
    setIsAuth(false);
  };

  const refreshUsuario = () => {
    const storedUser = localStorage.getItem("usuario");
    const storedRoles = localStorage.getItem("roles");
    try {
      setUsuario(storedUser ? JSON.parse(storedUser) : null);
      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      setUsuario(null);
      setRoles([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, usuario, roles, login, logout, refreshUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
