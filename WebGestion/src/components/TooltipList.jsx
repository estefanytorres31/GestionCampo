const TooltipList = ({
    items = [],
    defaultText = "-",
    countMode = true,         // true: muestra "2 roles", false: muestra "rol1, rol2"
    labelSingular = "",   // Etiqueta para 1 elemento (por ejemplo, "rol")
    labelPlural = "",    // Etiqueta para varios (por ejemplo, "roles")
  }) => {
    // Texto principal mostrado en la celda
    const mainText =
      items && items.length > 0
        ? countMode
          ? `${items.length} ${items.length > 1 ? labelPlural : labelSingular}`
          : items.join(", ")
        : defaultText;
  
    return (
      <div className="relative group inline-block">
        <span>{mainText}</span>
        {items && items.length > 0 && (
          <div
            className="
              absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
              bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg z-10
              opacity-0 pointer-events-none
              group-hover:opacity-100 group-hover:pointer-events-auto
              transition-all duration-300
              scale-95 group-hover:scale-100
            "
          >
            {items.join(", ")}
          </div>
        )}
      </div>
    );
  };
  
  export default TooltipList;
  