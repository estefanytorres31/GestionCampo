import { useState } from "react";
import useUsuarios from "../../hooks/usuarios/useUsuarios";
import Filters from "../../components/Filters";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import * as xlsx from "node-xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Table from "../../components/Table";
import { BsSearch } from "react-icons/bs";
import { formatId } from "../../utils/formatId";
import { MdAssignmentAdd } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import CreateUserModal from "./CreateUserModal";
import RowActions from "@/components/RowActions";
import { useNavigate } from "react-router-dom";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import DeleteUserModal from "./DeleteUserModal";
import EditUserModal from "./EditUserModal";
import TooltipList from "@/components/TooltipList";

const usuariosColumns = [
  { name: "ID", uuid: "id" },
  { name: "👤 Usuario", uuid: "nombre_usuario" },
  { name: "📛 Nombre Completo", uuid: "nombre_completo" },
  { name: "📧 Email", uuid: "email" },
  { name: "🎭 Roles", uuid: "roles" },
  { name: "⚙️ Acciones", uuid: "acciones" },
];

const Usuarios = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filters, setFilters] = useState({
    nombre_usuario: "",
    nombre_completo: "",
    email: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const navigate = useNavigate();

  const {
    data: usuarios,
    loading,
    error,
    pagination,
    refetch,
  } = useUsuarios(filters, page, pageSize);

  const exportToExcel = () => {
    if (!usuarios || usuarios.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const header = usuariosColumns.map((col) => col.name);
    const body = usuarios.map((row) =>
      usuariosColumns.map((col) => row[col.uuid] || "N/A")
    );

    const sheetData = [header, ...body];
    const buffer = xlsx.build([{ name: "Usuarios", data: sheetData }]);

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Usuarios.xlsx`);
  };

  /** Exportar a PDF */
  const exportToPDF = () => {
    if (!usuarios || usuarios.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Usuarios", 14, 10);

    const tableData = usuarios.map((row) =>
      usuariosColumns.map((col) => row[col.uuid] || "N/A")
    );

    doc.autoTable({
      head: [usuariosColumns.map((col) => col.name)],
      body: tableData,
      startY: 20,
    });

    doc.save("Usuarios.pdf");
  };

  /** Función de edición */
  const handleEdit = (row) => {
    setUserToEdit(row);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setUserToDelete(row);
    setIsDeleteModalOpen(true);
  };

  // Esta función se ejecuta luego de crear un usuario
  const handleSuccess = async (data) => {
    if (refetch && typeof refetch === "function") {
      try {
        await refetch();
      } catch (error) {
        console.error("Error al refrescar la lista de usuarios:", error);
      }
    }
  };

  // Redirigir a la pantalla de asignación de roles
  const handleAssignPermissions = (row) => {
    navigate(`/usuarios/${row.id}/asignar-roles`);
  };

  return (
    <>
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {userToEdit && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
          }}
          user={userToEdit}
          onSuccess={handleSuccess}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          user={userToDelete}
          onSuccess={handleSuccess}
        />
      )}
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        <div className="flex gap-2 items-center justify-between w-full overflow-auto">
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterFields={[
              {
                key: "nombre_usuario",
                type: "text",
                placeholder: "Buscar usuario",
                icon: <BsSearch className="text-gray-400" />,
              },
            ]}
          />
          <div className="flex gap-2 flex-col justify-end md:flex-row">
            {/* <Button color="filter" onClick={exportToPDF}>
              <VscFilePdf size={20} className="min-w-max" />
            </Button>
            <Button color="filter" onClick={exportToExcel}>
              <RiFileExcel2Fill size={20} className="min-w-max" />
            </Button> */}
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <IoAdd size={20} className="min-w-max" />
            Crear Usuario
          </Button>
        </div>
      </section>

      <main className="list-layout">
        <Table
          columns={usuariosColumns}
          data={usuarios}
          loading={loading}
          error={error}
          render={{
            id: (row) => formatId(row.id),
            roles: (row) => (
              <TooltipList
                items={row.roles}
                defaultText="Sin rol"
                countMode={true}
                labelSingular="rol"
                labelPlural="roles"
              />
            ),
            acciones: (row) => (
              <>
                <RowActions
                  row={row}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <Button
                  onClick={() => handleAssignPermissions(row)}
                  color="secondary"
                >
                  <MdAssignmentAdd size={20} className="min-w-max" />
                </Button>
              </>
            ),
          }}
        />
      </main>

      <Pagination pagination={pagination} setPage={setPage} />
    </>
  );
};

export default Usuarios;
