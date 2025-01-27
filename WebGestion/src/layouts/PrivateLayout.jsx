import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";
import SideBar from "./Sidebar";

export const PrivateLayout = ({ children }) => {
  const { isAuth, logout } = useAuth();
  const timeLeft = useTimer(5, () => {
    isAuth && (alert("¡Tiempo agotado!"), logout());
  });
  timeLeft;

  return (
    <div className="flex h-screen bg-white md:gap-9">
      <SideBar />
      <main className="flex flex-col flex-1 overflow-auto md:gap-5 px-2 md:pl-0 w-full h-full relative">
        {children}
      </main>
    </div>
  );
};
