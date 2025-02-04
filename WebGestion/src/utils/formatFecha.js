/** ✅ Formatea la fecha a YYYY-MM-DD HH:mm:ss */
export const formatFecha = (fecha) => {
    if (!fecha) return "⏳ Pendiente";
    const date = new Date(fecha);
    return `${date.toISOString().split("T")[0]} ${date.toISOString().split("T")[1].split(".")[0]}`;
  };