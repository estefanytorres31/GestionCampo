// CustomFilterToggle.jsx
import React from "react";
import { FilterIcon } from "lucide-react";

const CustomFilterToggle = ({ showFilters, toggleFilters }) => {
  return (
    <button
      onClick={toggleFilters}
      className="flex gap-1 items-center text-sm px-4 py-2 bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--border-color)] rounded-full shadow transition-all duration-300 hover:bg-[var(--hover-bg)] hover:shadow-lg cursor-pointer"
    >
      <FilterIcon size={20} />
      {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
    </button>
  );
};

export default CustomFilterToggle;
