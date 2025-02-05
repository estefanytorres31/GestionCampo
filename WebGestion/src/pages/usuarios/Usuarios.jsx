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
import { MdEdit, MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import CreateUserModal from "./CreateUserModal";

const Usuarios = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    nombre_usuario: "",
    nombre_completo: "",
    email: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const {
    data: usuarios,
    loading,
    error,
    pagination,
  } = useUsuarios(filters, page, pageSize);

  /** Exportar a Excel */
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
  const handleEdit = (user) => {
    alert(`Editar usuario: ${user.nombre_usuario}`);
  };

  const handleSuccess = (data) => {
    console.log("Usuario creado exitosamente", data);
    // Aquí podrías llamar a alguna función para refrescar la lista de usuarios
  };

  return (
    <>
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

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
              {
                key: "nombre_completo",
                type: "text",
                placeholder: "Buscar nombre completo",
                icon: <BsSearch className="text-gray-400" />,
              },
              {
                key: "email",
                type: "text",
                placeholder: "Buscar por email",
                icon: <BsSearch className="text-gray-400" />,
              },
            ]}
          />
          <div className="flex gap-2 flex-col justify-end md:flex-row">
            <Button color="filter" onClick={exportToPDF}>
              <MdEdit size={20} className="min-w-max" />
            </Button>
            <Button color="filter" onClick={exportToExcel}>
              <MdDelete size={20} className="min-w-max" />
            </Button>
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
            roles: (row) =>
              row.roles.length > 0 ? row.roles.join(", ") : "Sin rol",
            estado: (row) => (row.estado ? "🟢 Activo" : "🔴 Inactivo"),
            acciones: (row) => (
              <>
                <Button color="icon" onClick={() => handleEdit(row)}>
                  <MdEdit size={20} className="min-w-max" />
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

const usuariosColumns = [
  { name: "ID", uuid: "id" },
  { name: "👤 Usuario", uuid: "nombre_usuario" },
  { name: "📛 Nombre Completo", uuid: "nombre_completo" },
  { name: "📧 Email", uuid: "email" },
  { name: "✅ Estado", uuid: "estado" },
  { name: "🎭 Roles", uuid: "roles" },
  { name: "⚙️ Acciones", uuid: "acciones" },
];

export default Usuarios;
