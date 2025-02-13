import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import PrivateLayout from "./layouts/PrivateLayout";
import Asistencias from "./pages/asistencias/Asistencias";
import Usuarios from "./pages/usuarios/Usuarios";
import Permisos from "./pages/permisos/Permisos";
import Roles from "./pages/roles/Roles";
import AssignPermissionsPage from "./pages/roles/AssignPermissionsForm";
import "leaflet/dist/leaflet.css";
import Dashboard from "./pages/dashboard/Dashboard";
import AssignRolesForm from "./pages/usuarios/AssignRolesForm";
import Puerto from "./pages/puerto/Puerto";
import Embarcacion from "./pages/Embarcacion";
import HistorialPuerto from "./pages/puerto/HistorialPuerto";
import TrabajosAsignados from "./pages/trabajosasignados/TrabajosAsignados";
import Configuración from "./pages/configuracion/Configuración";
import CodigoDetalle from "./pages/trabajosasignados/CodigoDetalle";
import { getUniquePermissions } from "./utils/getUniquePermissions";

const AppContent = () => {
  const { isAuth, usuario, roles } = useAuth();
  const RootRedirect = () => {
    return isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
  };

  const PrivateRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" />;
  };

  console.log("usuario", usuario);
  console.log("roles", roles);

  const permissionsUsuario = getUniquePermissions(roles);

  const PrivateRouteWrapper = ({
    element: Component,
    authorizedPermissions,
  }) => {
    // const rol = roleMapper(user?.rol || 0);
    // const permission = permissionsUsuario(usuario)
    const hasPermission = authorizedPermissions.some((perm) =>
      permissionsUsuario.includes(perm)
    );

    return hasPermission ? <Component /> : <Navigate to="/dashboard" />;
  };
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/configuracion/temas"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Configuración />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/puerto"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Puerto />
              </PrivateLayout>
            </PrivateRoute>
          }
        /> */}
        {/* <Route
          path="/historial-puertos"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <HistorialPuerto />
              </PrivateLayout>
            </PrivateRoute>
          }
        /> */}
        {/* <Route
          path="/embarcacion"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Embarcacion />
              </PrivateLayout>
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/horas-hombre"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Horas Hombre"]}
                  element={Asistencias}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orden-trabajo"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Orden Trabajo"]}
                  element={TrabajosAsignados}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trabajos-asignados/:id_orden_trabajo/detalle-codigo"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Orden Trabajo"]}
                  element={CodigoDetalle}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Usuarios"]}
                  element={Usuarios}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios/:userId/asignar-roles"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Usuarios"]}
                  element={AssignRolesForm}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Roles"]}
                  element={Roles}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles/:roleId/asignar-permisos"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Roles"]}
                  element={AssignPermissionsPage}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/permisos"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <PrivateRouteWrapper
                  authorizedPermissions={["Ver Permisos"]}
                  element={Permisos}
                />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
