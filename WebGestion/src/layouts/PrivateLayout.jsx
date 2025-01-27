import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";

export const PrivateLayout = ({ children }) => {
    const { isAuth, logout } = useAuth();
    const timeLeft = useTimer(5, () => {
      isAuth && (
        alert("¡Tiempo agotado!"),
        logout()
      ) 
    });
    timeLeft;
  
    return (
      <div>
        <h1 className="text-white text-xl mb-4">¡Estás autenticado!</h1>
        {children}
        <Button onClick={logout}>Salir</Button>
      </div>
    );
}
