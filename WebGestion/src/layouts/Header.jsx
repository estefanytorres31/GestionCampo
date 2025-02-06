import React, { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const Header = ({ title }) => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const perfilCheckboxRef = useRef(null);

  // Función que maneja el clic en el botón de configuración
  const handleConfigClick = () => {
    // Cerrar el dropdown: desmarcar el checkbox
    if (perfilCheckboxRef.current) {
      perfilCheckboxRef.current.checked = false;
    }
    // Navegar a la configuración de temas
    navigate("/configuracion/temas");
  };

  return (
    <header
      className="header-layout px-4"
      style={{
        background: "var(--primary-bg)",
        color: "var(--primary-text)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Título de la página */}
      <section className="flex flex-1 items-center justify-start">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--primary-text)" }}
        >
          {title}
        </h1>
      </section>

      {/* Sección de configuración y perfil del usuario */}
      <section className="flex items-center gap-4">
        {/* Menú de perfil */}
        <section className="perfil-content relative">
          {/* Input oculto que controla la visibilidad del dropdown */}
          <input
            type="checkbox"
            id="perfil-checkbox"
            className="hidden"
            ref={perfilCheckboxRef}
          />
          <label htmlFor="perfil-checkbox" className="cursor-pointer">
            <CgProfile
              size={40}
              className="min-w-max"
              style={{ color: "var(--primary-text)" }}
            />
          </label>
          <dialog
            className="perfil-menu"
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              marginTop: "0.5rem",
              background: "var(--primary-bg)",
              color: "var(--primary-text)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "20px",
              padding: "1rem",
              zIndex: 999,
            }}
          >
            <span className="perfil-menu-item">
              {usuario ? usuario.nombreUsuario : ""}
            </span>
            <span className="perfil-menu-item">
              {usuario && usuario.roles ? usuario.roles.join(", ") : ""}
            </span>
            {/* Botón para ir a la configuración de temas */}
            <span
              onClick={handleConfigClick}
              className="perfil-menu-item text-blue-500 hover:text-blue-600 transition-colors"
            >
              Configuración
            </span>
          </dialog>
        </section>
      </section>
    </header>
  );
};

export default Header;
