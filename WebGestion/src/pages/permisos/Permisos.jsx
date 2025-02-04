import usePermisos from "../../hooks/usePermisos";
import ListPage from "../../components/ListPage";
import { BsSearch } from "react-icons/bs";
import { formatId } from "../../utils/formatId";
import CreatePermissionModal from "./CreatePermisoModal";

// ✅ Columnas de la tabla de permisos
const permisosColumns = [
  { name: "ID", uuid: "id" },
  { name: "🔑 Nombre", uuid: "nombre" },
  { name: "📝 Descripción", uuid: "descripcion" },
  { name: "📅 Creado en", uuid: "creado_en" },
  { name: "⏳ Estado", uuid: "estado" },
];

// ✅ Filtros de búsqueda
const permisosFilters = [
  { key: "nombre", type: "text", placeholder: "Buscar por nombre", icon: <BsSearch className="text-gray-400" /> },
];

/** ✅ Formatea la fecha a YYYY-MM-DD HH:mm:ss */
const formatFecha = (fecha) => {
  if (!fecha) return "⏳ Pendiente";
  const date = new Date(fecha);
  return `${date.toISOString().split("T")[0]} ${date.toISOString().split("T")[1].split(".")[0]}`;
};

export const Permisos = () => {
  return (
    <ListPage
      useFetchHook={usePermisos}
      columns={permisosColumns}
      filterFields={permisosFilters}
      title="Permisos"
      createButton={<CreatePermissionModal />}
      render={{
        id: (row) => formatId(row.id),
        creado_en: (row) => formatFecha(row.creado_en),
        estado: (row) => (row.estado ? "🟢 Activo" : "🔴 Inactivo"),
      }}
    />
  );
};
