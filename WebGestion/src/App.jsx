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

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Asistencias />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/asistencias"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Asistencias />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Usuarios />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Roles />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/permisos"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Permisos />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
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
