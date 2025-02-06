import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
      // Limpia el almacenamiento si no está autenticado
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("usuario");
      localStorage.removeItem("theme"); // Removemos el tema también
      setUsuario(null);
    }
  }, [isAuth]);

  const login = (data) => {
    // Se espera que data incluya: token, expiracion, userId, nombreUsuario, roles y theme
    const { token, expiracion, userId, nombreUsuario, roles, theme } = data;
    const usuarioData = { userId, nombreUsuario, roles, theme };

    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expiracion);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    if (theme) {
      console.log("tema", theme)
      localStorage.setItem("theme", theme);
    }

    setUsuario(usuarioData);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("usuario");
    localStorage.removeItem("theme");
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
