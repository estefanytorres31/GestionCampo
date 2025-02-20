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
import DeleteStop from "./DeleteStop";
import { useAuth } from "../../context/AuthContext"; // Importamos useAuth

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
const extractTimeFromISO = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const timePart = isoString.split('T')[1];
    const timeWithoutMillis = timePart.split('.')[0]; // "15:52:44"
    
    const [hours, minutes, seconds] = timeWithoutMillis.split(':').map(Number);
    
    const period = hours >= 12 ? 'p.m.' : 'a.m.';
    
    const displayHours = hours % 12 || 12;

    const formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
    
    return formattedTime;
  } catch (error) {
    console.error("Error extrayendo la hora:", error);
    return "Formato inválido";
  }
};

const Asistencias = () => {
  const [filters, setFilters] = useState(
    asistenciasFilters.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [asistenciaToStop, setAsistenciaToStop] = useState(null);
  const { roles } = useAuth(); // Obtenemos los roles del usuario actual

  // Verificamos si el usuario tiene el rol de Técnico
  const isTecnico = roles.some(role => role.nombre === "Técnico");

  const {
    data: asistencias,
    loading,
    error,
    pagination,
    refetch,
  } = useAsistencias(filters, page, pageSize);

  const handleStopAsistencia = (asistencia) => {
    console.log("Abriendo modal para detener asistencia:", asistencia);
    setAsistenciaToStop(asistencia);
  };

  const onStopComplete = (data) => {
    console.log("Asistencia detenida exitosamente:", data);
    setAsistenciaToStop(null);
    refetch(); // Recargar los datos después de detener la asistencia
  };

  // PDF
  const exportToPDF = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const doc = new jsPDF();
    doc.text("Reporte de Asistencias", 14, 10);
    const tableData = asistencias.map((row) =>
      asistenciasColumns.map((col) => {
        if (col.uuid === "fecha_hora_entrada" || col.uuid === "fecha_hora_salida") {
          return extractTimeFromISO(row[col.uuid]);
        }
        return row[col.uuid] || "N/A";
      })
    );
    doc.autoTable({
      head: [asistenciasColumns.map((col) => col.name)],
      body: tableData,
      startY: 20,
    });
    doc.save("Asistencias.pdf");
  };

  // Excel
  const exportToExcel = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const header = asistenciasColumns.map((col) => col.name);
    const body = asistencias.map((row) =>
      asistenciasColumns.map((col) => {
        if (col.uuid === "fecha_hora_entrada" || col.uuid === "fecha_hora_salida") {
          return extractTimeFromISO(row[col.uuid]);
        }
        return row[col.uuid] || "N/A";
      })
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
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        <div className="flex gap-2 items-center justify-between w-full overflow-auto">
          {customFiltersComponent({
            filters,
            setFilters,
            filterFields: asistenciasFilters,
          })}
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
              extractTimeFromISO(row.fecha_hora_entrada),
            fecha_hora_salida: (row) =>
              extractTimeFromISO(row.fecha_hora_salida),
            embarcacion: (row) => row.embarcacion || "Sin embarcación",
            horas_trabajo: (row) => {
              // Si ya tiene horas trabajadas, muestra las horas trabajadas
              if (row.horas_trabajo) {
                return row.horas_trabajo;
              }
              
              // Si no tiene fecha de salida
              if (!row.fecha_hora_salida) {
                // Si es técnico, solo muestra "⏳ En proceso"
                if (isTecnico) {
                  return (
                    <span className="text-gray-700 font-medium flex items-center">
                      ⌛ En proceso
                    </span>
                  );
                }
                
                // Para otros roles, muestra el botón Detener
                return (
                  <button 
                    className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition flex items-center justify-center"
                    onClick={() => handleStopAsistencia(row)}
                  >
                    Detener
                  </button>
                );
              }
              
              return "Calculando...";
            },
            ubicacion: (row) => (
              <div className="flex flex-col gap-1">
                {row.coordenadas_entrada ? (
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
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
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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

      {/* Modal para detener la asistencia - no se mostrará para técnicos*/}
      {asistenciaToStop && !isTecnico && (
        <DeleteStop 
          asistencia={asistenciaToStop} 
          onClose={() => setAsistenciaToStop(null)}
          onComplete={onStopComplete}
        />
      )}

      <Pagination pagination={pagination} setPage={setPage} />
    </>
  );
};

export default Asistencias;