import { BsSearch } from "react-icons/bs";
import { Input } from "./Input";

export const Filters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-2 items-start w-full flex-col md:flex-row">
      {/* <div className="flex gap-2 items-center justify-between"> */}
      <Input
        placeholder="Buscar registro"
        iconLeft={<BsSearch className="text-gray-400" />}
        className="border border-[#0D1E4C] rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-[#0D1E4C] flex-1"
        type="text"
        value={filters.nombre_completo}
        onChange={(e) =>
          setFilters({ ...filters, nombre_completo: e.target.value })
        }
      />
      <Input
        type="date"
        className="border border-[#0D1E4C] rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-[#0D1E4C] w-full flex-1"
        value={filters.fecha}
        onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
      />
      {/* </div> */}
      <Input
        className="border border-[#0D1E4C] rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-[#0D1E4C] flex-1"
        type="text"
        placeholder="Embarcación"
        value={filters.nombre_embarcacion}
        onChange={(e) =>
          setFilters({ ...filters, nombre_embarcacion: e.target.value })
        }
      />
    </div>
  );
};
