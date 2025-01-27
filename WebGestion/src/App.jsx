import fondo from "./assets/fondo.png";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { PrivateLayout } from "./layouts/PrivateLayout";
import { Dashboard } from "./pages/Dashboard";

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center grid place-items-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PrivateLayout>
                hola
                {/* <Usuarios /> */}
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </div>
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
