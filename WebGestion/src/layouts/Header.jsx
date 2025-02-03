import React from "react";
import { useAuth } from "@/context/AuthContext";

const Header = ({ title }) => {
  const { usuario, logout } = useAuth();

  return (
    <header className="header-layout bg-white flex items-center justify-between z-5 p-4 relative">
      {/* Título */}
      <section className="flex justify-start items-center flex-1">
        <h1 className="text-left text-2xl font-bold text-gray-800">{title}</h1>
      </section>

      {/* Perfil del usuario autenticado */}
      <section className="flex items-center gap-4 relative">
        {usuario ? (
          <>
            <div className="flex flex-col text-right">
              <span className="font-semibold text-gray-700">{usuario.nombreUsuario}</span>
              <span className="text-sm text-gray-500">{usuario.roles.join(", ")}</span>
            </div>

          </>
        ) : (
          <span className="text-gray-500">No autenticado</span>
        )}
      </section>
    </header>
  );
};

export default Header;
