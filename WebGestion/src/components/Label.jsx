export const Label = ({ children, className = "", ...props }) => {
  return (
    <label className={`label ${className}`} {...props}>
      {children}
    </label>
  );
};
