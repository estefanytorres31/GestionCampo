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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import CustomFilterToggle from "../../components/CustomFilterToggle";
import FiltroAsistencias from "./FiltroAsistencias";
import { watermarkDataUrl } from "./logoBases64";

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

  const formatRowForExport = (row) => {
    return [
      formatId(row.id),
      row.nombre_completo,
      row.fecha,
      new Date(row.fecha_hora_entrada).toLocaleTimeString(),
      new Date(row.fecha_hora_salida).toLocaleTimeString(),
      row.embarcacion || "Sin embarcación",
      row.empresa || "N/A",
      // En lugar de las coordenadas, devolvemos un objeto con link y texto:
      row.coordenadas_entrada
        ? {
            text: "Ver Ubicación",
            url: `https://www.google.com/maps?q=${row.coordenadas_entrada.latitud},${row.coordenadas_entrada.longitud}`,
          }
        : { text: "Entrada no disponible", url: "" },
      row.horas_trabajo || "En proceso",
    ];
  };
  const exportHeaders = [
    "ID",
    "Nombre",
    "Fecha",
    "Entrada",
    "Salida",
    "Embarcación",
    "Cliente",
    "Ubicación",
    "Horas Trabajadas",
  ];

  const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  };
  const exportToPDF = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();

    // 1. Agregar una marca de agua de gran tamaño (opcional, para el fondo general)

    // 2. Diseñar el título del PDF con fondo y línea decorativa
    doc.setFillColor(230, 230, 230); // Fondo gris claro
    doc.rect(10, 5, 190, 15, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Reporte de Asistencias", 14, 16);
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22);

    // 3. Preparar la tabla de datos
    const startY = 25;
    const tableData = asistencias.map((row) => formatRowForExport(row));

    doc.autoTable({
      head: [exportHeaders],
      body: tableData,
      startY,
      didDrawCell: function (data) {
        if (data.column.index === 7) {
          const cellValue = data.cell.raw;
          if (cellValue && cellValue.url) {
            const textWidth = doc.getTextWidth(cellValue.text);
            const xPos = data.cell.x + (data.cell.width - textWidth) / 2;
            const yPos = data.cell.y + data.cell.height / 2 + 3;
            doc.textWithLink(cellValue.text, xPos, yPos, {
              url: cellValue.url,
            });
          }
        }
      },
      didParseCell: function (data) {
        if (data.column.index === 7 && typeof data.cell.raw === "object") {
          data.cell.text = [""];
        }
      },
      // Callback que se ejecuta en cada página (después de dibujar la tabla)
      didDrawPage: function (data) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Configuración para la marca de agua:
        // Imagen original: 148x33 píxeles. Queremos un ancho de 30 mm.
        const watermarkWidth = 30; // mm
        const originalWidth = 148;
        const originalHeight = 33;
        const aspectRatio = originalHeight / originalWidth;
        const watermarkHeight = watermarkWidth * aspectRatio; // Aproximadamente 6.7 mm

        const margin = 10; // margen desde el borde
        // Ubicarla en la esquina inferior derecha
        const x = pageWidth - watermarkWidth - margin;
        const y = pageHeight - watermarkHeight - margin;

        doc.addImage(
          watermarkDataUrl, // Data URL de tu imagen PNG en base64
          "PNG", // Formato
          x, // Posición x
          y, // Posición y
          watermarkWidth, // Ancho en mm
          watermarkHeight // Alto en mm
        );
      },
    });

    const timestamp = getTimestamp();
    const fileName = `Asistencias_${timestamp}.pdf`;
    doc.save(fileName);
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (!asistencias || asistencias.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = asistenciasColumns.map((col) => col.name);

    const body = asistencias.map((row) =>
      formatRowForExport(row).map((cell) => {
        if (cell && typeof cell === "object" && cell.text) {
          return cell.text;
        }
        return cell;
      })
    );

    const sheetData = [headers, ...body];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const timestamp = getTimestamp();
    const fileName = `Asistencias_${timestamp}.xlsx`;
    saveAs(blob, fileName);
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
