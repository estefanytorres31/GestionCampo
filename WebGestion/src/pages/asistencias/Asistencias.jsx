// Asistencias.jsx
import { useState } from "react";
import useAsistencias from "../../hooks/asistencias/useAsistencias";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import { formatId } from "../../utils/formatId";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomFilterToggle from "../../components/CustomFilterToggle";
import FiltroAsistencias from "./FiltroAsistencias";

const asistenciasColumns = [
  { name: "ID", uuid: "id" },
  { name: "👤 Nombre", uuid: "nombre_completo" },
  { name: "📅 Fecha", uuid: "fecha" },
  { name: "🕰️ Entrada", uuid: "fecha_hora_entrada" },
  { name: "🚪 Salida", uuid: "fecha_hora_salida" },
  { name: "⛵ Embarcación", uuid: "embarcacion" },
  { name: "📍 Cliente", uuid: "empresa" },
  { name: "🌍 Ubicación", uuid: "ubicacion" },
  { name: "⏳ Horas Trabajadas", uuid: "horas_trabajo" },
];

const asistenciasFilters = [
  {
    key: "nombre_completo",
    type: "text",
    placeholder: "Buscar por nombre",
  },
  {
    key: "fecha",
    type: "date",
    placeholder: "Fecha de entrada",
  },
  {
    key: "nombre_embarcacion",
    type: "text",
    placeholder: "Buscar por Embarcación",
  },
];

const Asistencias = () => {
  // Estado de filtros y de paginación
  const [filters, setFilters] = useState(
    asistenciasFilters.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  // Estado para mostrar/ocultar el área de filtros
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: asistencias,
    loading,
    error,
    pagination,
  } = useAsistencias(filters, page, pageSize);

  // Función para exportar a PDF
  const exportToPDF = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const doc = new jsPDF();
    doc.text("Reporte de Asistencias", 14, 10);
    const tableData = asistencias.map((row) =>
      asistenciasColumns.map((col) => row[col.uuid] || "N/A")
    );
    doc.autoTable({
      head: [asistenciasColumns.map((col) => col.name)],
      body: tableData,
      startY: 20,
    });
    doc.save("Asistencias.pdf");
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const header = asistenciasColumns.map((col) => col.name);
    const body = asistencias.map((row) =>
      asistenciasColumns.map((col) => row[col.uuid] || "N/A")
    );
    const sheetData = [header, ...body];
    const xlsx = require("node-xlsx");
    const buffer = xlsx.build([{ name: "Asistencias", data: sheetData }]);
    const FileSaver = require("file-saver");
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, "Asistencias.xlsx");
  };

  // Componente custom de filtros para la cabecera:
  const customFiltersComponent = ({ filters, setFilters, filterFields }) => (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex justify-between w-full">
        <CustomFilterToggle
          showFilters={showFilters}
          toggleFilters={() => setShowFilters((prev) => !prev)}
        />
        <div className="flex gap-2">
          <Button color="filter" onClick={exportToPDF}>
            <VscFilePdf size={20} className="min-w-max" />
          </Button>
          <Button color="filter" onClick={exportToExcel}>
            <RiFileExcel2Fill size={20} className="min-w-max" />
          </Button>
        </div>
      </div>
      {showFilters && (
        <FiltroAsistencias filters={filters} setFilters={setFilters} />
      )}
    </div>
  );

  return (
    <>
      {/* Cabecera con filtros y botones de exportación */}
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        <div className="flex gap-2 items-center justify-between w-full overflow-auto">
          {customFiltersComponent({
            filters,
            setFilters,
            filterFields: asistenciasFilters,
          })}
          {/* Aquí podrías agregar otros elementos, como un botón de "Crear" si es necesario */}
        </div>
      </section>

      {/* Listado */}
      <main className="list-layout">
        <Table
          columns={asistenciasColumns}
          data={asistencias}
          loading={loading}
          error={error}
          render={{
            id: (row) => formatId(row.id),
            nombre_completo: (row) => row.nombre_completo,
            fecha: (row) => row.fecha,
            fecha_hora_entrada: (row) =>
              new Date(row.fecha_hora_entrada).toLocaleTimeString(),
            fecha_hora_salida: (row) =>
              new Date(row.fecha_hora_salida).toLocaleTimeString(),
            embarcacion: (row) => row.embarcacion || "Sin embarcación",
            horas_trabajo: (row) => row.horas_trabajo || "⏳ En proceso",
            ubicacion: (row) => (
              <div className="flex flex-col gap-1">
                {row.coordenadas_entrada ? (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${row.coordenadas_entrada.latitud},${row.coordenadas_entrada.longitud}`,
                        "_blank"
                      )
                    }
                  >
                    Entrada
                  </button>
                ) : (
                  <span className="text-gray-500">Entrada no disponible</span>
                )}
                {row.coordenadas_salida ? (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${row.coordenadas_salida.latitud},${row.coordenadas_salida.longitud}`,
                        "_blank"
                      )
                    }
                  >
                    Salida
                  </button>
                ) : (
                  <span className="text-gray-500">Salida no disponible</span>
                )}
              </div>
            ),
          }}
        />
      </main>

      <Pagination pagination={pagination} setPage={setPage} />
    </>
  );
};

export default Asistencias;
