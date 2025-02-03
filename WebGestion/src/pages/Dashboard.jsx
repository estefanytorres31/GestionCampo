import { useState } from "react";
import useAsistencias from "../hooks/useAsistencias";
import { Table } from "../components/Table";
import { Pagination } from "../components/Pagination";
import { Filters } from "../components/Filters";
import { Button } from "@/components/Button";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from "xlsx"; // Importar XLSX para Excel
import jsPDF from "jspdf";
import "jspdf-autotable"; // Para exportar tablas en PDF

const columns = [
  { name: "ID", uuid: "id" },
  { name: "Nombre", uuid: "nombre_completo" },
  { name: "Fecha", uuid: "fecha" },
  { name: "Entrada", uuid: "fecha_hora_entrada" },
  { name: "Salida", uuid: "fecha_hora_salida" },
  { name: "Latitud", uuid: "latitud" },
  { name: "Longitud", uuid: "longitud" },
  { name: "Embarcación", uuid: "embarcacion" },
  { name: "Horas Trabajadas", uuid: "horas_trabajo" },
];
export const Dashboard = () => {
  const [filters, setFilters] = useState({
    nombre_completo: "",
    fecha: "",
    id_embarcacion: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(2);

  const {
    data: asistencias,
    loading,
    error,
    pagination,
  } = useAsistencias(filters, page, pageSize);

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
      head: [
        [
          "ID",
          "Nombre",
          "Fecha",
          "Entrada",
          "Salida",
          "Latitud",
          "Longitud",
          "Embarcación",
          "Horas Trabajadas",
        ],
      ],
      body: tableData,
      startY: 20,
    });

    doc.save("Asistencias.pdf");
  };

  if (loading) return <p>Cargando asistencias...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">General</h1> */}
        {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">Asistencias</h1> */}
        <div className="flex gap-2 items-center justify-between w-full overflow-auto">
          <Filters filters={filters} setFilters={setFilters} />
          <div className="flex gap-2 flex-col justify-end md:flex-row w-max-[100px]">
            <Button
              color="report"
              width="w-min-[100px] md:w-min"
              className="flex gap-1"
              onClick={exportToPDF}
            >
              <VscFilePdf size={20} className="min-w-max" />
              PDF
            </Button>
            <Button
              color="report"
              width="w-max md:w-min"
              className="flex gap-1"
              onClick={exportToExcel}
            >
              <RiFileExcel2Fill size={20} className="min-w-max" />
              Excel
            </Button>
          </div>
        </div>
      </section>
      <main className="list-layout">
        <Table columns={columns} data={asistencias} />
      </main>

      <Pagination pagination={pagination} setPage={setPage} />
    </>
  );
};
