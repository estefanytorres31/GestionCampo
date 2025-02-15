import React, { memo } from "react";
import { Input } from "@/components/Input";
import { X } from "lucide-react";
import Button from "@/components/Button";

// Extraemos el componente de input y lo memorizamos para que no se recree en cada render.
const FilterInput = memo(({ label, type, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm"
      style={{ color: "var(--primary-text)" }}
    >{label}</label>
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
));

const FiltroAsistencias = ({ filters, setFilters }) => {
  // Función para reiniciar todos los filtros
  const resetFilters = () => {
    setFilters({
      nombre_completo: "",
      nombre_embarcacion: "",
      fecha: "",
      fecha_inicio: "",
      fecha_fin: "",
      empresa: "",
    });
  };

  return (
    <div
      className="p-6 rounded-lg shadow-lg flex flex-col gap-4 px-8 pt-6 pb-8 w-full relative"
      style={{ background: "var(--primary-bg)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-medium-jetbrains">Búsqueda por Filtros</h3>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-sm text-[var(--primary-text)] px-4 py-2 bg-[var(--primary-bg)] border border-[var(--border-color)] rounded-full transition-all duration-300 hover:bg-[var(--hover-bg)] hover:shadow-lg cursor-pointer"
        >
          <X size={16} />
          <span>Limpiar filtros</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Primera fila de filtros */}
        <div className="flex w-full gap-2">
          <FilterInput
            label="Nombre:"
            type="text"
            placeholder="Buscar por nombre"
            value={filters.nombre_completo || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                nombre_completo: e.target.value,
              }))
            }
          />
          <FilterInput
            label="Embarcación:"
            type="text"
            placeholder="Buscar por embarcación"
            value={filters.nombre_embarcacion || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                nombre_embarcacion: e.target.value,
              }))
            }
          />
          <FilterInput
            label="Cliente:"
            type="text"
            placeholder="Buscar por cliente"
            value={filters.empresa || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, empresa: e.target.value }))
            }
          />
        </div>

        {/* Segunda fila de filtros */}
        <div
          className="flex flex-col w-full gap-2"
        >
          <div className="flex w-full gap-2">
            <FilterInput
              label="Fecha:"
              type="date"
              placeholder="Fecha"
              value={filters.fecha || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, fecha: e.target.value }))
              }
            />
            <FilterInput
              label="Desde:"
              type="date"
              placeholder="Fecha inicio entrada"
              value={filters.fecha_inicio || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  fecha_inicio: e.target.value,
                }))
              }
            />
            <FilterInput
              label="Hasta:"
              type="date"
              placeholder="Fecha fin entrada"
              value={filters.fecha_fin || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, fecha_fin: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltroAsistencias;
