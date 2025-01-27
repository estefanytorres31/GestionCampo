import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    return token && expiration && new Date().getTime() < new Date(expiration).getTime();
  });

  useEffect(() => {
    if (!isAuth) {
      // Limpia el almacenamiento si no está autenticado
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("usuario");
    }
  }, [isAuth]);

  const login = (data) => {
    const { token, expiracion, usuario } = data;

    // Guarda los datos en el almacenamiento local
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expiracion); // ISO string
    localStorage.setItem("usuario", JSON.stringify(usuario)); // Guardar datos del usuario

    setIsAuth(true);
  };

  const logout = () => {
    // Elimina los datos del almacenamiento local y desloguea
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("usuario");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
