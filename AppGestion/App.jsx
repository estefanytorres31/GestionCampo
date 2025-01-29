import "react-native-gesture-handler";
import Navigation from "./Navigation"; 
import AuthProvider from "./screens/context/Auth/AuthProvider.jsx";
import EmpresaProvider from "./screens/context/Empresa/EmpresaProvider.jsx";
import EmbarcacionProvider from "./screens/context/Embarcacion/EmbarcacionProvider.jsx";

export default function App(){
  return(
    
    <AuthProvider>
      <EmbarcacionProvider>
      <EmpresaProvider>
      <Navigation/>
      </EmpresaProvider>
      </EmbarcacionProvider>
    </AuthProvider>
  )
}