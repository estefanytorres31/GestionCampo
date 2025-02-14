import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";
import SideBar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const PrivateLayout = ({ children }) => {
  const { isAuth, logout } = useAuth();
  const location = useLocation(); // Obtener la ruta actual
  const [layoutOffset, setLayoutOffset] = useState(false);
  const tokenExpiration = localStorage.getItem("tokenExpiration");
  const timeLeft = tokenExpiration
    ? Math.max(0, Math.floor((Number(tokenExpiration) - Date.now()) / 1000))
    : 0;

  useTimer(timeLeft, () => {
    if (isAuth) {
      alert("¡Token expirado!");
      logout();
    }
  });

  // Definir títulos según la ruta
  const pageTitle = useMemo(() => {
    const titles = {
      "/dashboard": "Panel de Control",
      "/horas_hombre": "Gestión de Horas Hombre",
      "/usuarios": "Gestión de Usuarios",
      "/roles": "Gestión de Roles",
      "/permisos": "Gestión de Permisos",
      "/configuracion": "Configuración",
      "/trabajos-asignados": "Gestión de Trabajos Asignados",
      "/trabajos-asignados/:id_orden_trabajo/detalle-codigo":
        "Detalle del Código",
    };

    location.pathname.includes("detalle-codigo")
      ? setLayoutOffset(true)
      : setLayoutOffset(false);

    return titles[location.pathname] || "Gestión de Campo";
  }, [location.pathname]);

  useEffect(() => {
    document.title = `${pageTitle} - Gestión de Campo`;
  }, [pageTitle]);

  return (
    <div
      className="flex h-screen"
      style={{
        background: "var(--secondary-bg)",
        color: "var(--primary-text)",
      }}
    >
      <SideBar />
      <main className="flex flex-col flex-1 overflow-auto md:pl-0 w-full h-full">
        <Header title={pageTitle} />
        {!layoutOffset ? (
          <div className="h-full flex flex-col justify-start gap-4 overflow-auto relative m-5">
            {children}
          </div>
        ) : (
          <>{children}</>
        )}
      </main>
    </div>
  );
};

export default PrivateLayout;
