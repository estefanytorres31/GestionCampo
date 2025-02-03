import { useState } from "react";
import useUsuarios from "../hooks/useUsuarios";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { Button } from "../components/Button";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as xlsx from "node-xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Table from "../components/Table";
import { BsSearch } from "react-icons/bs";
import { formatId } from "../utils/formatId";

const Roles = () => {
  const [filters, setFilters] = useState({
    nombre_usuario: "",
    nombre_completo: "",
    email: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: usuarios, loading, error, pagination } = useUsuarios(filters, page, pageSize);

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

  return (
    <>
      <section className="flex flex-col justify-between items-center gap-4 w-full">
        <div className="flex gap-2 items-center justify-between w-full overflow-auto">
          <Filters
            filters={filters}
            setFilters={setFilters}
            filterFields={[
              { key: "nombre_usuario", type: "text", placeholder: "Buscar usuario", icon: <BsSearch className="text-gray-400" /> },
              { key: "nombre_completo", type: "text", placeholder: "Buscar nombre completo", icon: <BsSearch className="text-gray-400" /> },
              { key: "email", type: "text", placeholder: "Buscar por email", icon: <BsSearch className="text-gray-400" /> },
            ]}
          />
          <div className="flex gap-2 flex-col justify-end md:flex-row">
            <Button className="flex gap-1" onClick={exportToPDF}>
              <VscFilePdf size={20} className="min-w-max" />
              PDF
            </Button>
            <Button className="flex gap-1" onClick={exportToExcel}>
              <RiFileExcel2Fill size={20} className="min-w-max" />
              Excel
            </Button>
          </div>
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
            roles: (row) => (row.roles.length > 0 ? row.roles.join(", ") : "Sin rol"),
            estado: (row) => (row.estado ? "🟢 Activo" : "🔴 Inactivo"),
            acciones: (row) => (
              <Button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(row)}>
                Editar
              </Button>
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

export default Roles;
