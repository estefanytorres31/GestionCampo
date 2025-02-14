
const FiltroAsistencias = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filters.nombre_completo || ""}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, nombre_completo: e.target.value }))
        }
        className="border border-gray-300 rounded px-2 py-1"
      />
      <input
        type="date"
        placeholder="Fecha de entrada..."
        value={filters.fecha || ""}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, fecha: e.target.value }))
        }
        className="border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
};

export default FiltroAsistencias;
