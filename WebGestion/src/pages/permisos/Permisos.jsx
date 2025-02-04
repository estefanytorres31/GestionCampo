import React, { useMemo, useState, useRef } from "react";
import usePermisos from "../../hooks/permisos/usePermisos";
import ListPage from "../../components/ListPage";
import { BsSearch } from "react-icons/bs";
import { formatId } from "../../utils/formatId";
import Button from "@/components/Button";
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import CreatePermissionModal from "./CreatePermissionModal";
import EditPermissionModal from "./EditPermissionModal";
import DeletePermissionModal from "./DeletePermissionModal";
import RowActions from "@/components/RowActions";

// Definición de las columnas de la tabla
const permisosColumns = [
  { name: "ID", uuid: "id" },
  { name: "🔑 Nombre", uuid: "nombre" },
  { name: "📝 Descripción", uuid: "descripcion" },
  { name: "⏳ Estado", uuid: "estado" },
  { name: "⚙️ Acciones", uuid: "acciones" },
];

// Filtros de búsqueda
const permisosFilters = [
  {
    key: "nombre",
    type: "text",
    placeholder: "Buscar por nombre",
    icon: <BsSearch className="text-gray-400" />,
  },
];

const Permisos = () => {
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState(null);
  const [permissionToDelete, setPermissionToDelete] = useState(null);

  // Ref para la función de refetch de la lista
  const listPageRefetchRef = useRef(null);

  // Función para refrescar la lista tras una operación exitosa
  const handleSuccess = async (data) => {
    console.log("Operación exitosa", data);
    if (
      listPageRefetchRef.current &&
      typeof listPageRefetchRef.current === "function"
    ) {
      try {
        await listPageRefetchRef.current();
      } catch (error) {
        console.error("Error al refrescar la lista de permisos:", error);
      }
    }
  };

  // Funciones de acción para editar y eliminar
  const handleEdit = (permission) => {
    setPermissionToEdit(permission);
    setIsEditModalOpen(true);
  };

  const handleDelete = (permission) => {
    setPermissionToDelete(permission);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      {/* Modal para crear permiso */}
      <CreatePermissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Modal para editar permiso */}
      {permissionToEdit && (
        <EditPermissionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setPermissionToEdit(null);
          }}
          permission={permissionToEdit}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal para eliminar permiso */}
      {permissionToDelete && (
        <DeletePermissionModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPermissionToDelete(null);
          }}
          permission={permissionToDelete}
          onSuccess={handleSuccess}
        />
      )}

      <ListPage
        useFetchHook={usePermisos}
        columns={permisosColumns}
        filterFields={permisosFilters}
        title="Permisos"
        createButton={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IoAdd size={20} className="min-w-max" />
            Crear Permiso
          </Button>
        }
        // Asignamos la función refetch al ref
        onRefetch={(refetch) => {
          if (typeof refetch === "function") {
            listPageRefetchRef.current = refetch;
          }
        }}
        render={{
          id: (row) => formatId(row.id),
          estado: (row) => (row.estado ? "🟢 Activo" : "🔴 Inactivo"),
          acciones: (row) => (
            <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
          ),
        }}
      />
    </>
  );
};

export default Permisos;
