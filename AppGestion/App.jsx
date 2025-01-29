import "react-native-gesture-handler";
import Navigation from "./Navigation"; 
import AuthProvider from "./screens/context/Auth/AuthProvider.jsx";
import EmpresaProvider from "./screens/context/Empresa/EmpresaProvider.jsx";

export default function App(){
  return(
    
    <AuthProvider>
      <EmpresaProvider>
      <Navigation/>
      </EmpresaProvider>
    </AuthProvider>
  )
}