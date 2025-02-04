import usePermisos from "../../hooks/permisos/usePermisos";
import ListPage from "../../components/ListPage";
import { BsSearch } from "react-icons/bs";
import { formatId } from "../../utils/formatId";
import Button from "@/components/Button";
import { formatFecha } from "@/utils/formatFecha";
import { IoAdd } from "react-icons/io5";

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

const Permisos = () => {
  return (
    <ListPage
      useFetchHook={usePermisos}
      columns={permisosColumns}
      filterFields={permisosFilters}
      title="Permisos"
      createButton={
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <IoAdd size={20} className="min-w-max" />
          Crear Rol
        </Button>
      }
      render={{
        id: (row) => formatId(row.id),
        creado_en: (row) => formatFecha(row.creado_en),
        estado: (row) => (row.estado ? "🟢 Activo" : "🔴 Inactivo"),
      }}
    />
  );
};

export default Permisos;