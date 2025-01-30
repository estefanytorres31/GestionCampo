import "react-native-gesture-handler";
import Navigation from "./Navigation";
import AuthProvider from "./screens/context/Auth/AuthProvider.jsx";
import EmpresaProvider from "./screens/context/Empresa/EmpresaProvider.jsx";
import EmbarcacionProvider from "./screens/context/Embarcacion/EmbarcacionProvider.jsx";
import TipoTrabajoProvider from "./screens/context/TipoTrabajo/TipoTrabajoProvider.jsx";
import UsuarioTecnicoProvider from "./screens/context/UsuarioTecnico/UsuarioTecnicoProvider.jsx";
import PuertoProvider from "./screens/context/Puerto/PuertoProvider.js";
export default function App() {
  return (
    <AuthProvider>
      <PuertoProvider>
        <UsuarioTecnicoProvider>
          <TipoTrabajoProvider>
            <EmbarcacionProvider>
              <EmpresaProvider>
                <Navigation />
              </EmpresaProvider>
            </EmbarcacionProvider>
          </TipoTrabajoProvider>
        </UsuarioTecnicoProvider>
      </PuertoProvider>
    </AuthProvider>
  );
}
