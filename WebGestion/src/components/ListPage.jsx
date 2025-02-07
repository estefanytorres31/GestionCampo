import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import Filters from "../components/Filters";
import Button from "../components/Button";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as xlsx from "node-xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Table from "./Table";

const ListPage = ({
  useFetchHook,
  columns,
  filterFields,
  title,
  render = {},
  createButton,
  onRefetch,
  // Props opcionales para exportar: si se pasan, se usan; si no, se usan las funciones por defecto
  onExportExcel,
  onExportPDF,
  showExportButtons = true,
}) => {
  const [filters, setFilters] = useState(
    filterFields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, loading, error, pagination, refetch } = useFetchHook(
    filters,
    page,
    pageSize
  );

  useEffect(() => {
    if (onRefetch && typeof refetch === "function") {
      onRefetch(refetch);
    }
  }, [refetch, onRefetch]);

  // Función de exportación a Excel por defecto
  const defaultExportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const header = columns.map((col) => col.name);
    const body = data.map((row) =>
      columns.map((col) => {
        // Si la columna es "orden_trabajo_usuario", extraemos el responsable
        if (col.uuid === "orden_trabajo_usuario") {
          const responsable =
            row.orden_trabajo_usuario &&
            row.orden_trabajo_usuario.find(
              (u) => u.rol_en_orden === "Responsable"
            );
          return responsable
            ? responsable.usuario.nombre_completo
            : "Sin responsable";
        }
        // Para otros campos que sean objetos, intentamos extraer la propiedad 'nombre_completo' o lo convertimos a cadena
        if (typeof row[col.uuid] === "object" && row[col.uuid] !== null) {
          return row[col.uuid].nombre_completo || JSON.stringify(row[col.uuid]);
        }
        return row[col.uuid] || "N/A";
      })
    );
    const sheetData = [header, ...body];
    const buffer = xlsx.build([{ name: title, data: sheetData }]);
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${title}.xlsx`);
  };

  // Función de exportación a PDF por defecto
  const defaultExportToPDF = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const doc = new jsPDF();
    doc.text(`Reporte de ${title}`, 14, 10);
    const tableData = data.map((row) =>
      columns.map((col) => {
        if (col.uuid === "orden_trabajo_usuario") {
          const responsable =
            row.orden_trabajo_usuario &&
            row.orden_trabajo_usuario.find(
              (u) => u.rol_en_orden === "Responsable"
            );
          return responsable
            ? responsable.usuario.nombre_completo
            : "Sin responsable";
        }
        if (typeof row[col.uuid] === "object" && row[col.uuid] !== null) {
          return row[col.uuid].nombre_completo || JSON.stringify(row[col.uuid]);
        }
        return row[col.uuid] || "N/A";
      })
    );
    doc.autoTable({
      head: [columns.map((col) => col.name)],
      body: tableData,
      startY: 20,
    });
    doc.save(`${title}.pdf`);
  };

  const handleExportToExcel = () => {
    if (typeof onExportExcel === "function") {
      onExportExcel(data, columns, title);
    } else {
      defaultExportToExcel();
    }
  };

  const handleExportToPDF = () => {
    if (typeof onExportPDF === "function") {
      onExportPDF(data, columns, title);
    } else {
      defaultExportToPDF();
    }
  };

  return (
    <>
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        <div
          className={`flex gap-2 items-center w-full ${
            filterFields.length > 0 ? "justify-between" : "justify-end"
          }`}
        >
          <div>
            {filterFields.length > 0 && (
              <Filters
                filters={filters}
                setFilters={setFilters}
                filterFields={filterFields}
              />
            )}
          </div>
          <div className="flex gap-2 md:items-end justify-end md:flex-row">
            {showExportButtons && (
              <>
                <Button
                  color="filter"
                  className="flex gap-1"
                  onClick={handleExportToPDF}
                >
                  <VscFilePdf size={20} className="min-w-max" />
                </Button>
                <Button
                  color="filter"
                  className="flex gap-1"
                  onClick={handleExportToExcel}
                >
                  <RiFileExcel2Fill size={20} className="min-w-max" />
                </Button>
              </>
            )}
            {createButton && createButton}
          </div>
        </div>
      </section>

      <main className="list-layout">
        <Table
          columns={columns}
          data={data}
          render={render}
          loading={loading}
          error={error}
        />
      </main>

      <Pagination pagination={pagination} setPage={setPage} />
    </>
  );
};

export default ListPage;
