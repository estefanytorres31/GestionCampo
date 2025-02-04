const Button = ({
  tag: Tag = "button",
  children,
  className = "",
  color = "default",
  width = "md:w-56",
  ...props
}) => {
  const computedWidth = width || (color.includes("icon") ? "" : "md:w-56");

  return (
    <Tag
      className={`button button-${color} ${computedWidth} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Button;