import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    // Recupera el estado de autenticación y verifica el tiempo de expiración
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (token && expiration && new Date().getTime() < Number(expiration)) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!isAuth) {
      // Limpia el almacenamiento si no está autenticado
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
    }
  }, [isAuth]);

  const login = () => {
    // Parámetros predefinidos
    const token = "mockToken123"; // Token simulado
    const expiration = Date.now() + 5 * 1000; 

    // Almacena el token y el tiempo de expiración en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expiration.toString());
    setIsAuth(true);
  };

  const logout = () => {
    // Elimina los datos del almacenamiento local y desloguea
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
