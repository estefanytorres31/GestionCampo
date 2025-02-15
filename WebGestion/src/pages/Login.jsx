import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import fondo from "@/assets/images/fondo2.jpg";
import logo from "@/assets/logo.svg";
import { InputLabel } from "../components/InputLabel";
import { useForm } from "../hooks/useForm";
import axiosInstance from "../config/axiosConfig";
import { FaUser, FaLock } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Asegúrate de la ruta correcta

const Login = () => {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const { formState, onInputChange } = useForm({
    usuario: "",
    contrasena: "",
  });
  const { usuario: usuarioInput, contrasena } = formState;

  const { selectedTheme } = useTheme();

  // Define los temas que ya usan degradados en sus variables
  const gradientThemes = new Set([
    "neon-purple",
    "dracula",
    "monokai",
  ]);

  // Define el estilo de fondo condicional
  const backgroundStyle = gradientThemes.has(selectedTheme)
    ? { background: "var(--primary-bg)" }
    : { background: "linear-gradient(to bottom, var(--primary-bg), var(--secondary-bg))" };

  const handleLogin = async () => {
    if (!usuarioInput || !contrasena) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", { usuario: usuarioInput, contrasena });

      if (response.status === 200) {
        const { token, expiracion, userId, nombreUsuario, nombreCompleto, rolesPorId, theme } = response.data;

        login({ token, expiracion, userId, nombreUsuario, nombreCompleto, rolesPorId, theme });
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al iniciar sesión.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center grid place-items-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <section
        className="flex flex-col items-center justify-center gap-4 rounded-xl p-8 shadow-md"
        style={backgroundStyle}
      >
        <img src={logo} alt="logo" className="w-32 md:w-64" />

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold" style={{ color: "var(--primary-text)" }}>
            Gestión de Campo
          </h1>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          {/* Campo Usuario */}
          <InputLabel
            label="Usuario"
            name="usuario"
            placeholder="Escribe tu usuario"
            iconRight={<FaUser style={{ color: "var(--primary-text)" }} />}
            value={usuarioInput}
            className="text-medium-jetbrains"
            onChange={onInputChange}
          />
          {/* Campo Contraseña */}
          <InputLabel
            label="Contraseña"
            name="contrasena"
            type="password"
            placeholder="Escribe tu contraseña"
            iconRight={<FaLock style={{ color: "var(--primary-text)" }} />}
            value={contrasena}
            className="text-medium-jetbrains"
            onChange={onInputChange}
          />

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <Button type="submit" className="mt-12">
            Iniciar sesión
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Login;
