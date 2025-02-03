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
import { Usuarios } from "./pages/Usuarios";

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
                <Dashboard />
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
        />s
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
