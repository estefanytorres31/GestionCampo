const UserAvatar = ({
  user,
  size = 40,
  bgColor = "var(--button-bg)",
  textColor = "var(--primary-bg)",
}) => {
  // Si no hay usuario, se retorna null (o un placeholder si lo prefieres)
  if (!user) return null;

  // Función para obtener las iniciales:
  // Se usa 'nombreCompleto' si existe; de lo contrario, se usa 'nombreUsuario'
  const getUserInitials = (user) => {
    const fullName = user.nombreCompleto || user.nombreUsuario || user.nombre_completo || user.nombre_usuario || "";
    const words = fullName.trim().split(/\s+/);
    if (words.length === 0) return "";
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    // Se toman las primeras letras de las dos primeras palabras y se convierten a mayúsculas
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const initials = getUserInitials(user);

  return (
    <h1
      className="flex items-center justify-center rounded-full font-bold uppercase cursor-pointer select-none"
      style={{
        width: size,
        height: size,
        background: bgColor,
        color: textColor,
      }}
    >
      {initials}
    </h1>
  );
};

export default UserAvatar;
