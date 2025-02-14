// CustomFilterToggle.js
import React from "react";

const CustomFilterToggle = ({ filters, setFilters, showFilters, toggleFilters }) => {
  return (
    <button onClick={toggleFilters} className="bg-gray-300 px-4 py-2 rounded">
      {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
    </button>
  );
};

export default CustomFilterToggle;
