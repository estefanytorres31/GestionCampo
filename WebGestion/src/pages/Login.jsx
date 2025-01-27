import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/Button";
import fondo from "@/assets/images/fondo.png";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // Actualiza el estado de autenticación
    navigate("/dashboard"); // Redirige a la página principal
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center grid place-items-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <h1>Login</h1>
      <Button onClick={handleLogin} color="default md:w-[240px]]" className="mt-12">Iniciar sesión</Button>
    </div>
  );
};
