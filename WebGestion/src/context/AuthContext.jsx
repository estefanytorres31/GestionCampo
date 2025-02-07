// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext"; // Asegúrate de que ThemeProvider envuelva a AuthProvider

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setSpecificTheme } = useTheme(); // Extraemos la función para actualizar el tema
  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");
    return token && expiration && new Date().getTime() < new Date(expiration).getTime();
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

  useEffect(() => {
    if (!isAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("usuario");
      // Opcionalmente, se puede remover el tema
      // localStorage.removeItem("theme");
      setUsuario(null);
    }
  }, [isAuth]);

  const login = (data) => {
    const { token, expiracion, userId, nombreUsuario, nombreCompleto, roles, theme } = data;
    const usuarioData = { userId, nombreUsuario, nombreCompleto, roles, theme };

    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expiracion);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    // Guardamos el tema recibido en localStorage
    if (theme) localStorage.setItem("theme", theme);

    setUsuario(usuarioData);
    setIsAuth(true);
    // Actualizamos el ThemeContext con el tema del usuario
    if (theme) setSpecificTheme(theme);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("usuario");
    // Opcionalmente, se puede limpiar el tema o dejarlo para el siguiente usuario
    // localStorage.removeItem("theme");
    setUsuario(null);
    setIsAuth(false);
  };

  const refreshUsuario = () => {
    const storedUser = localStorage.getItem("usuario");
    try {
      setUsuario(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, usuario, login, logout, refreshUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
