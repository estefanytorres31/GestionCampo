import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";
import SideBar from "./Sidebar";
import Header from "./Header";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import { Input } from "@/components/Input";
import { BsSearch } from "react-icons/bs";

export const PrivateLayout = ({ children }) => {
  const { isAuth, logout } = useAuth();

  const tokenExpiration = localStorage.getItem("tokenExpiration");
  const timeLeft = tokenExpiration
    ? Math.max(0, Math.floor((Number(tokenExpiration) - Date.now()) / 1000))
    : 0;

  useTimer(timeLeft, () => {
    if (isAuth) {
      alert("¡Token expirado!");
      logout();
    }
  });

  return (
    <div className="flex h-screen bg-gray-100 md:gap-9">
      <SideBar />
      <main className="flex flex-col flex-1 overflow-auto md:gap-5 px-2 md:pl-0 w-full h-full relative pr-5 pb-5">
        {/* header */}
        <Header title={"Gestión de Campo"} />
        {/* main */}
        <section className="flex flex-col justify-between items-start gap-4 w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">General</h1>
          <div className="flex gap-2 items-center justify-between w-full">
            <Input
              placeholder="Buscar registro"
              iconLeft={<BsSearch className="text-gray-400" />}
              className="border border-[#83A6CE] rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-[#83A6CE]"
            />
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
        </section>
        <main className="list-layout">{children}</main>
      </main>
    </div>
  );
};
