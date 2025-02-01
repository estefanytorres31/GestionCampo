import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import useTimer from "@/hooks/useTimer";
import useAsistencias from "@/hooks/useAsistencias"; // Importar el hook
import SideBar from "./Sidebar";
import Header from "./Header";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import { Input } from "@/components/Input";
import { BsSearch } from "react-icons/bs";
import * as XLSX from "xlsx"; // Importar XLSX para Excel
import jsPDF from "jspdf";
import "jspdf-autotable"; // Para exportar tablas en PDF

export const PrivateLayout = ({ children }) => {
  const { isAuth, logout } = useAuth();
  const { asistencias } = useAsistencias(); // Obtener datos de asistencias

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

  /** Exportar a Excel */
  const exportToExcel = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(asistencias);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");

    XLSX.writeFile(workbook, "Asistencias.xlsx");
  };

  /** Exportar a PDF */
  const exportToPDF = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Asistencias", 14, 10);

    const tableData = asistencias.map((row) => [
      row.id_entrada,
      row.nombre_completo,
      row.fecha,
      row.fecha_hora_entrada,
      row.fecha_hora_salida || "N/A",
      row.latitud,
      row.longitud,
      row.embarcacion,
      row.horas_trabajo || "N/A",
    ]);

    doc.autoTable({
      head: [["ID", "Nombre", "Fecha", "Entrada", "Salida", "Latitud", "Longitud", "Embarcación", "Horas Trabajadas"]],
      body: tableData,
      startY: 20,
    });

    doc.save("Asistencias.pdf");
  };

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
              <Button color="report" width="w-min" className="flex gap-1" onClick={exportToPDF}>
                <VscFilePdf size={20} className="min-w-max" />
                PDF
              </Button>
              <Button color="report" width="w-min" className="flex gap-1" onClick={exportToExcel}>
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
