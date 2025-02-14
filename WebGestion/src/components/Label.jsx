export const Label = ({ children, className = "", ...props }) => {
  return (
    <label className={`label ${className}`} {...props}
      style={{
        color: "var(--input-text)",
      }}
    >
      {children}
    </label>
  );
};
