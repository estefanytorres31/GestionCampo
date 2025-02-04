import React, { useMemo, useState, useRef } from "react";
import ListPage from "@/components/ListPage";
import useRoles from "../../hooks/roles/useRoles";
import { BsSearch } from "react-icons/bs";
import { formatId } from "@/utils/formatId";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import Button from "@/components/Button";
import { IoAdd } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";

const rolesColumns = [
  { name: "ID", uuid: "id" },
  { name: "🔑 Nombre", uuid: "nombre_rol" },
  { name: "📝 Descripción", uuid: "descripcion" },
  { name: "⏳ Estado", uuid: "estado" },
  { name: "⚙️ Acciones", uuid: "acciones" },
];

const rolesFilters = [
  {
    key: "nombre_rol",
    type: "text",
    placeholder: "Buscar por nombre",
    icon: <BsSearch className="text-gray-400" />,
  },
];

const Roles = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);

  // Usamos un ref para guardar la función refetch
  const listPageRefetchRef = useRef(null);

  // Si manejas filtros a nivel de Roles (esto es opcional)
  const [filters, setFilters] = useState({});
  const memoizedFilters = useMemo(() => filters, [filters]);

  const handleSuccess = async (data) => {
    console.log("Operación exitosa", data);
    if (
      listPageRefetchRef.current &&
      typeof listPageRefetchRef.current === "function"
    ) {
      try {
        await listPageRefetchRef.current();
      } catch (error) {
        console.error("Error al refrescar la lista de roles:", error);
      }
    } else {
      console.warn(
        "La función refetch no está disponible en el ref:",
        listPageRefetchRef.current
      );
    }
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

      <ListPage
        useFetchHook={useRoles}
        columns={rolesColumns}
        filterFields={rolesFilters}
        title="Roles"
        createButton={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IoAdd size={20} className="min-w-max" />
            Crear Rol
          </Button>
        }
        // En lugar de usar state, asignamos la función refetch al ref
        onRefetch={(refetch) => {
          if (typeof refetch === "function") {
            listPageRefetchRef.current = refetch;
          }
        }}
        render={{
          id: (row) => formatId(row.id),
          estado: (row) => (row.estado ? "🟢 Activo" : "🔴 Inactivo"),
          acciones: (row) => (
            <>
              <Button
                color="icon"
                onClick={() => {
                  setRoleToEdit(row);
                  setIsEditModalOpen(true);
                }}
              >
                <MdEdit size={20} className="min-w-max" />
              </Button>
              <Button
                color="icon"
                onClick={() => {
                  setRoleToEdit(row);
                  setIsEditModalOpen(true);
                }}
              >
                <MdDelete size={20} className="min-w-max" />
              </Button>
            </>
          ),
        }}
      />
    </>
  );
};

export default Roles;
