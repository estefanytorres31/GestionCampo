import { useState } from "react";
import { Table } from "../components/Table";
import { Pagination } from "../components/Pagination";
import { Filters } from "../components/Filters";
import { Button } from "@/components/Button";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as xlsx from "node-xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

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

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const header = columns.map((col) => col.name);
    const body = data.map((row) => columns.map((col) => row[col.uuid] || "N/A"));

    const sheetData = [header, ...body];
    const buffer = xlsx.build([{ name: title, data: sheetData }]);

    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(blob, `${title}.xlsx`);
  };

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
          { filterFields.length > 0 && <Filters filters={filters} setFilters={setFilters} filterFields={filterFields} /> }
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
