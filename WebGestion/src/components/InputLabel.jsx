import { Label } from "./Label";
import { Input } from "./Input";

export const InputLabel = ({
  children,
  id = "",
  name = id,
  label = id,
  placeholder = label,
  className = "",
  classInput = "",
  iconLeft, // Ícono opcional a la izquierda
  iconRight, // Ícono opcional a la derecha
  propsLabel,
  ...props
}) => {
  return (
    <Label className={`input-label flex flex-col gap-1 ${className}`} {...propsLabel}>
      {children || label}
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        className={`w-full ${classInput}`}
        iconLeft={iconLeft} // Pasa el ícono izquierdo
        iconRight={iconRight} // Pasa el ícono derecho
        {...props}
      />
    </Label>
  );
};
