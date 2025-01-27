import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    // Recupera el estado de autenticación del almacenamiento local
    return localStorage.getItem("isAuth") === "true";
  });

  useEffect(() => {
    // Almacena el estado de autenticación en el almacenamiento local
    localStorage.setItem("isAuth", isAuth);
  }, [isAuth]);

  const login = () => setIsAuth(true);
  const logout = () => setIsAuth(false);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
