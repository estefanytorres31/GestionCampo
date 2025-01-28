import "react-native-gesture-handler";
import Navigation from "./Navigation"; 
import AuthProvider from "./screens/context/Auth/AuthProvider.jsx";

export default function App(){
  return(
    <AuthProvider>
      <Navigation/>
    </AuthProvider>
    
  )
}