import { useState } from "react";
import { Table } from "../components/Table";
import { Pagination } from "../components/Pagination";
import { Filters } from "../components/Filters";
import { Button } from "@/components/Button";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as xlsx from "node-xlsx"; // Importar node-xlsx
import jsPDF from "jspdf";
import "jspdf-autotable"; // Para exportar tablas en PDF
import { saveAs } from "file-saver"; // Para descargar el archivo

const ListPage = ({ useFetchHook, columns, filterFields, title }) => {
  const [filters, setFilters] = useState(
    filterFields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, loading, error, pagination } = useFetchHook(
    filters,
    page,
    pageSize
  );

  /** Exportar a Excel con node-xlsx */
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Crear la estructura de la hoja de Excel
    const header = columns.map((col) => col.name); // Encabezados
    const body = data.map((row) => columns.map((col) => row[col.uuid] || "N/A")); // Datos

    const sheetData = [header, ...body]; // Combinar encabezados y datos
    const buffer = xlsx.build([{ name: title, data: sheetData }]); // Crear el archivo

    // Crear un Blob para descargar
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(blob, `${title}.xlsx`);
  };

  /** Exportar a PDF */
  const exportToPDF = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Reporte de ${title}`, 14, 10);

    const tableData = data.map((row) =>
      columns.map((col) => row[col.uuid] || "N/A")
    );

    doc.autoTable({
      head: [columns.map((col) => col.name)],
      body: tableData,
      startY: 20,
    });

    doc.save(`${title}.pdf`);
  };

  if (loading) return <p>Cargando {title.toLowerCase()}...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        <div className="flex gap-2 items-center justify-between w-full overflow-auto">
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterFields={filterFields}
          />
          <div className="flex gap-2 flex-col justify-end md:flex-row w-max-[100px] z-10">
            <Button className="flex gap-1" onClick={exportToPDF}>
              <VscFilePdf size={20} className="min-w-max" />
              PDF
            </Button>
            <Button className="flex gap-1" onClick={exportToExcel}>
              <RiFileExcel2Fill size={20} className="min-w-max" />
              Excel
            </Button>
          </div>
        </div>
      </section>
      <main className="list-layout">
        <Table columns={columns} data={data} />
      </main>
      <Pagination pagination={pagination} setPage={setPage} />
    </>
  );
};

export default ListPage;
