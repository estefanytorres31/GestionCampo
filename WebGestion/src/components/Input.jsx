export const Input = ({
  className = "",
  iconLeft = null, // Ícono a la izquierda
  iconRight = null, // Ícono a la derecha
  ...props
}) => {
  return (
    <div className="relative flex items-center justify-start w-full">
      {/* Ícono a la izquierda */}
      {iconLeft && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {iconLeft}
        </div>
      )}
      {/* Input */}
      <input
        className={`input w-full ${iconLeft ? "pl-10" : ""} ${
          iconRight ? "pr-10" : ""
        } ${className}`}
        {...props}
      />
      {/* Ícono a la derecha */}
      {iconRight && (
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          {iconRight}
        </div>
      )}
    </div>
  );
};
