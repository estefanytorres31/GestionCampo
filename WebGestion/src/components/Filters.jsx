import { BsSearch } from "react-icons/bs";
import { Input } from "./Input";

export const Filters = ({ filters, setFilters, filterFields }) => {
  return (
    <div className="flex gap-2 items-start w-full flex-col md:flex-row">
      {filterFields.map(({ key, type, placeholder, icon }) => (
        <Input
          key={key}
          type={type}
          placeholder={placeholder}
          value={filters[key]}
          iconLeft={icon}
          className="border border-[#0D1E4C] rounded-lg py-2 px-4 focus:outline-none focus:ring flex-1"
          onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
        />
      ))}
    </div>
  );
};