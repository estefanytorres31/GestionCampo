import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/Button";
import fondo from "@/assets/images/fondo.png";
import logo from "@/assets/logo.svg";
import { InputLabel } from "@/components/InputLabel";
import { useForm } from "@/hooks/useForm";
import axiosInstance from "@/config/axiosConfig";
import { FaUser, FaLock } from "react-icons/fa";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const { formState, onInputChange } = useForm({
    usuario: "",
    contrasena: "",
  });

  const { usuario, contrasena } = formState;

  const handleLogin = async () => {
    // Validación básica
    if (!usuario || !contrasena) {
      setErrorMessage("Por favor, completa todos los campos.");
      console.log("Error al iniciar sesión.", { usuario, contrasena });
      return;
    }

    login();
    navigate("/dashboard");

    // try {
    //const response = await axiosInstance.post("/api/login", { usuario, contrasena });

    //   if (response.status === 200) {
    //     login(response.data);
    //     navigate("/dashboard");
    //   }
    // } catch (error) {
    //   setErrorMessage(
    //     error.response?.data?.message || "Error al iniciar sesión."
    //   );
    // }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center grid place-items-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <section className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white via-white to-blue-500 rounded-xl p-8 shadow-md">
        <img src={logo} alt="logo" className="w-32 md:w-64" />

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Campo</h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Usuario */}
          <InputLabel
            label="Usuario"
            name="usuario"
            placeholder="Escribe tu usuario"
            iconRight={<FaUser className="text-gray-400" />}
            value={usuario}
            onChange={onInputChange}
          />
          
          {/* Contraseña */}
          <InputLabel
            label="Contraseña"
            name="contrasena"
            type="password"
            placeholder="Escribe tu contraseña"
            iconRight={<FaLock className="text-gray-400" />}
            value={contrasena}
            onChange={onInputChange}
          />  
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        <Button onClick={handleLogin} className="mt-12">
          Iniciar sesión
        </Button>
      </section>
    </div>
  );
};
