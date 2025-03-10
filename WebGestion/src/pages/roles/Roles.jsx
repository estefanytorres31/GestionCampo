import React, { useMemo, useState, useRef } from "react";
import ListPage from "@/components/ListPage";
import useRoles from "../../hooks/roles/useRoles";
import { BsSearch } from "react-icons/bs";
import { formatId } from "@/utils/formatId";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import Button from "@/components/Button";
import RowActions from "@/components/RowActions";
import { IoAdd } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TooltipList from "@/components/TooltipList";

const rolesColumns = [
  { name: "ID", uuid: "id" },
  { name: "🔑 Nombre", uuid: "nombre_rol" },
  { name: "📝 Descripción", uuid: "descripcion" },
  { name: "📜 Permisos", uuid: "permisos" },
  { name: "⚙️ Acciones", uuid: "acciones" },
];

const rolesFilters = [
  {
    key: "nombre_rol",
    type: "text",
    placeholder: "Buscar por nombre de rol",
    icon: <BsSearch className="text-gray-400" />,
  },
];

const Roles = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const listPageRefetchRef = useRef(null);

  // Inicializamos el estado de filtros a partir de rolesFilters
  const [filters, setFilters] = useState(
    rolesFilters.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const memoizedFilters = useMemo(() => filters, [filters]);

  const navigate = useNavigate();

  const handleSuccess = async (data) => {
    if (listPageRefetchRef.current && typeof listPageRefetchRef.current === "function") {
      try {
        await listPageRefetchRef.current();
      } catch (error) {
        console.error("Error al refrescar la lista de roles:", error);
      }
    }
  };

  const handleEdit = (row) => {
    setRoleToEdit(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setRoleToDelete(row);
    setIsDeleteModalOpen(true);
  };

  // Redirigir a la pantalla de asignación de permisos
  const handleAssignPermissions = (row) => {
    navigate(`/roles/${row.id}/asignar-permisos`);
  };

  return (
    <>
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {roleToEdit && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setRoleToEdit(null);
          }}
          role={roleToEdit}
          onSuccess={handleSuccess}
        />
      )}

      {roleToDelete && (
        <DeleteRoleModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setRoleToDelete(null);
          }}
          role={roleToDelete}
          onSuccess={handleSuccess}
        />
      )}

      <ListPage
        useFetchHook={useRoles}
        columns={rolesColumns}
        filters={memoizedFilters}
        filterFields={rolesFilters}
        title="Roles"
        showExportButtons={false}
        createButton={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IoAdd size={20} className="min-w-max" />
            Crear Rol
          </Button>
        }
        onRefetch={(refetch) => {
          if (typeof refetch === "function") {
            listPageRefetchRef.current = refetch;
          }
        }}
        render={{
          id: (row) => formatId(row.id),
          permisos: (row) => (
            <TooltipList
              items={row.roles_permisos}
              defaultText="Sin permisos"
              countMode={true}
              labelSingular="permiso"
              labelPlural="permisos"
            />
          ),
          acciones: (row) => (
            <>
              <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
              <Button onClick={() => handleAssignPermissions(row)} color="secondary">
                <MdAssignmentAdd size={20} className="min-w-max" />
              </Button>
            </>
          ),
        }}
      />
    </>
  );
};

export default Roles;
