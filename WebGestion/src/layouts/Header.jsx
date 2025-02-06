// Header.jsx
import React from "react";
import { useAuth } from "@/context/AuthContext";

const Header = ({ title }) => {
  const { usuario } = useAuth();

  return (
    <header
      className="header-layout p-4 flex items-center justify-between"
      style={{
        backgroundColor: "var(--primary-bg)",
        color: "var(--primary-text)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Título */}
      <section className="flex flex-1 items-center justify-start">
        <h1 className="text-2xl font-bold" style={{ color: "var(--primary-text)" }}>
          {title}
        </h1>
      </section>

      {/* Perfil del usuario autenticado */}
      <section className="flex items-center gap-4">
        {usuario ? (
          <div className="flex flex-col text-right">
            <span className="font-semibold" style={{ color: "var(--primary-text)" }}>
              {usuario.nombreUsuario}
            </span>
            <span className="text-sm" style={{ color: "var(--border-color)" }}>
              {usuario.roles.join(", ")}
            </span>
          </div>
        ) : (
          <span style={{ color: "var(--border-color)" }}>No autenticado</span>
        )}
      </section>
    </header>
  );
};

export default Header;
