import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import UserAvatar from "@/components/UserAvatar";
import { MdKeyboardArrowLeft } from "react-icons/md";

const Header = ({ title }) => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const perfilCheckboxRef = useRef(null);
  const location = useLocation();

  // Función para regresar a la ruta anterior
  const handleBack = () => {
    navigate(-1);
  };

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

  // Si la ruta actual incluye "detalle-codigo", se mostrará el botón de retroceder
  const showBackButton = location.pathname.includes("detalle-codigo");

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
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="flex flex-row items-center gap-2 text-[var(--primary-text)] hover:text-[var(--button-hover-bg)]/50 transition-colors duration-300 cursor-pointer"
          >
            <MdKeyboardArrowLeft size={30} className="min-w-max" />
            <h1 className="text-2xl font-bold">{title}</h1>
          </button>
        ) : (
          <h1
            className="text-2xl font-bold cursor-default"
            style={{ color: "var(--primary-text)" }}
          >
            {title}
          </h1>
        )}
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
