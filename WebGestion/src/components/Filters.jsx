import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { Input } from "./Input";

const Filters = ({ filters, setFilters, filterFields }) => {
  const lastInputRef = useRef(null); // Guardar referencia al último input utilizado

  const handleInputChange = (key, value, inputRef) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));

    lastInputRef.current = inputRef; // Guardar la referencia del input actual
  };

  return (
    <div className="flex gap-2 items-start w-full flex-col md:flex-row">
      {filterFields.map(({ key, type, placeholder, icon }) => (
        <Input
          key={key}
          type={type}
          placeholder={placeholder}
          value={filters[key]}
          iconLeft={icon}
          ref={(el) => {
            if (el && key === Object.keys(filters).find((f) => filters[f] !== "")) {
              lastInputRef.current = el; // Guardar el último input donde se escribió
            }
          }}
          className="border rounded-lg focus:outline-none flex-1 md:max-w-[355px]"
          style={{ borderColor: "var(--border-color)" }}
          onChange={(e) => handleInputChange(key, e.target.value, e.target)}
        />
      ))}
    </div>
  );
};

export default Filters;