import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";
import SideBar from "./Sidebar";
import Header from "./Header";

export const PrivateLayout = ({ children }) => {
  const { isAuth, logout } = useAuth();
  const timeLeft = useTimer(500, () => {
    isAuth && (alert("¡Tiempo agotado!"), logout());
  });
  timeLeft;

  return (
    <div className="flex h-screen bg-gray-100 md:gap-9">
      <SideBar />
      <main className="flex flex-col flex-1 overflow-auto md:gap-5 px-2 md:pl-0 w-full h-full relative">
        {/* header */}
        <Header title={"Gestión de Campo"} />
        {/* main */}
        <main className="list-layout">
        {children}
        </main>
      </main>
    </div>
  );
};
