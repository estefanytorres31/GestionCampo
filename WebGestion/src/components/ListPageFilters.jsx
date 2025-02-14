// ListPageFilters.jsx
import React from "react";
import Filters from "../components/Filters";

const ListPageFilters = ({
  filters,
  setFilters,
  filterFields,
  // Si se desea, se puede pasar un componente de filtros customizado
  customFiltersComponent,
}) => {
  return (
    <>
      {customFiltersComponent ? (
        // Se espera que el componente custom reciba (filters, setFilters, filterFields)
        customFiltersComponent({ filters, setFilters, filterFields })
      ) : (
        <Filters
          filters={filters}
          setFilters={setFilters}
          filterFields={filterFields}
        />
      )}
    </>
  );
};

export default ListPageFilters;
