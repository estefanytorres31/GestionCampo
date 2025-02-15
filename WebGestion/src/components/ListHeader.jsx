// ListHeader.jsx
import React from "react";
import Button from "../components/Button";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import Filters from "../components/Filters";

const ListHeader = ({
  filters,
  setFilters,
  filterFields,
  // Si se pasa, se usará el componente custom de filtros (debe ser una función que retorne JSX)
  customFiltersComponent,
  // Props para los botones de exportación:
  showExportButtons = true,
  onExportPDF,
  onExportExcel,
  createButton,
  // Alternativamente, otro componente si no se quieren filtros por defecto
  alternativeComponent,
}) => {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 items-start justify-between w-full">
        <div>
          {filterFields && filterFields.length > 0 ? (
            customFiltersComponent ? (
              customFiltersComponent({ filters, setFilters, filterFields })
            ) : (
              <Filters
                filters={filters}
                setFilters={setFilters}
                filterFields={filterFields}
              />
            )
          ) : (
            alternativeComponent || null
          )}
        </div>
        <div className="flex gap-2 md:items-start justify-end md:flex-row">
          {showExportButtons && (
            <>
              <Button color="filter" className="flex gap-1" onClick={onExportPDF}>
                <VscFilePdf size={20} className="min-w-max" />
              </Button>
              <Button color="filter" className="flex gap-1" onClick={onExportExcel}>
                <RiFileExcel2Fill size={20} className="min-w-max" />
              </Button>
            </>
          )}
          {createButton && createButton}
        </div>
      </div>
    </section>
  );
};

export default ListHeader;
