import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";
import SideBar from "./Sidebar";
import Header from "./Header";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";

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
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">General</h1>
          <div className="flex gap-2">
            <Button color="report" width="w-min" className="flex gap-1">
              <VscFilePdf size={20} className="min-w-max" />
              PDF
            </Button>
            <Button color="report" width="w-min" className="flex gap-1">
              <RiFileExcel2Fill size={20} className="min-w-max" />
              Excel
            </Button>
          </div>
        </div>
        <main className="list-layout">{children}</main>
      </main>
    </div>
  );
};
