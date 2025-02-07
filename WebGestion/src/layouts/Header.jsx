import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import UserAvatar from "@/components/UserAvatar";

const Header = ({ title }) => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const perfilCheckboxRef = useRef(null);
  const location = useLocation();

  const handleConfigClick = () => {
    if (perfilCheckboxRef.current) {
      perfilCheckboxRef.current.checked = false;
    }
    navigate("/configuracion/temas");
  };

  useEffect(() => {
    if (perfilCheckboxRef.current) {
      perfilCheckboxRef.current.checked = false;
    }
  }, [location.pathname]);

  return (
    <header
      className="header-layout px-4"
      style={{
        background: "var(--primary-bg)",
        color: "var(--primary-text)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <section className="flex flex-1 items-center justify-start">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--primary-text)" }}
        >
          {title}
        </h1>
      </section>
      <section className="flex items-center gap-4">
        <section className="perfil-content relative">
          <input
            type="checkbox"
            id="perfil-checkbox"
            className="hidden"
            ref={perfilCheckboxRef}
          />
          <label htmlFor="perfil-checkbox" className="cursor-pointer">
            <UserAvatar user={usuario} size={40} />
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
            <span className="perfil-menu-item block mb-2">
              {usuario ? usuario.nombreUsuario : ""}
            </span>
            <span className="perfil-menu-item block mb-2">
              {usuario ? usuario.nombreCompleto : ""}
            </span>
            <span className="perfil-menu-item block mb-2">
              {usuario && usuario.roles ? usuario.roles.join(", ") : ""}
            </span>
            <button
              onClick={handleConfigClick}
              className="perfil-menu-item text-blue-500 hover:text-blue-600 transition-colors"
            >
              Configuración de Temas
            </button>
          </dialog>
        </section>
      </section>
    </header>
  );
};

export default Header;
