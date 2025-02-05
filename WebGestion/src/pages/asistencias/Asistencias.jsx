import useAsistencias from "../../hooks/asistencias/useAsistencias";
import ListPage from "../../components/ListPage";
import { BsSearch } from "react-icons/bs";
import { formatId } from "../../utils/formatId";

const asistenciasColumns = [
  { name: "ID", uuid: "id" },
  { name: "👤 Nombre", uuid: "nombre_completo" },
  { name: "📅 Fecha", uuid: "fecha" },
  { name: "🕰️ Entrada", uuid: "fecha_hora_entrada" },
  { name: "🚪 Salida", uuid: "fecha_hora_salida" },
  { name: "⛵ Embarcación", uuid: "embarcacion" },
  { name: "🌍 Ubicación", uuid: "ubicacion" },
  { name: "⏳ Horas Trabajadas", uuid: "horas_trabajo" },
];

const asistenciasFilters = [
  {
    key: "nombre_completo",
    type: "text",
    placeholder: "Buscar por nombre",
    icon: <BsSearch className="text-gray-400" />,
  },
  { key: "fecha", type: "date", placeholder: "Fecha de entrada" },
  {
    key: "nombre_embarcacion",
    type: "text",
    placeholder: "Buscar por Embarcación",
    icon: <BsSearch className="text-gray-400" />,
  },
];

/** ✅ Formatea la fecha a HH:mm:ss */
const formatFechaHora = (fecha) => {
  if (!fecha) return "⏳ Pendiente";
  const date = new Date(fecha);
  return date.toISOString().split("T")[1].split(".")[0]; // HH:mm:ss
};

/** ✅ Función para abrir Google Maps */
const openGoogleMaps = (lat, lon) => {
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  window.open(url, "_blank");
};

const Asistencias = () => {
  return (
    <ListPage
      useFetchHook={useAsistencias}
      columns={asistenciasColumns}
      filterFields={asistenciasFilters}
      title="Asistencias"
      render={{
        id: (row) => formatId(row.id),
        nombre_completo: (row) => row.nombre_completo,
        fecha: (row) => row.fecha, // Ya en formato YYYY-MM-DD
        fecha_hora_entrada: (row) => formatFechaHora(row.fecha_hora_entrada),
        fecha_hora_salida: (row) => formatFechaHora(row.fecha_hora_salida),
        embarcacion: (row) => row.embarcacion || "Sin embarcación",
        horas_trabajo: (row) => row.horas_trabajo || "⏳ En proceso",
        ubicacion: (row) => (
          <div className="flex flex-col gap-1">
            {row.coordenadas_entrada ? (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                onClick={() =>
                  openGoogleMaps(
                    row.coordenadas_entrada.latitud,
                    row.coordenadas_entrada.longitud
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
                  openGoogleMaps(
                    row.coordenadas_salida.latitud,
                    row.coordenadas_salida.longitud
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
  );
};

export default Asistencias;
