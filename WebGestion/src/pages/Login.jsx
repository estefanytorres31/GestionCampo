import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/Button";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // Actualiza el estado de autenticación
    navigate("/dashboard"); // Redirige a la página principal
  };

  return (
    <div>
      <h1>Login</h1>
      <Button onClick={handleLogin}>Iniciar sesión</Button> 
    </div>
  );
};
