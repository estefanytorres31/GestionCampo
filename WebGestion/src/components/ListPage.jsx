// ListPage.jsx
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import Table from "./Table";
import * as xlsx from "node-xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

const ListPage = ({
  useFetchHook,
  columns,
  filters, // Estado de filtros administrado externamente
  title,
  render = {},
  createButton,
  onRefetch,
  // Props opcionales para exportar:
  onExportExcel,
  onExportPDF,
  showExportButtons = true,
}) => {
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
