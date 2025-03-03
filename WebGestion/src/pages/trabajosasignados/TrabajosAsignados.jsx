import React, { useState, useRef } from "react";
import ListPage from "@/components/ListPage";
import useTrabajosAsignados from "@/hooks/trabajosAsignados/useTrabajosAsignados";
import UserAvatarRowTooltip from "@/components/UserAvatarWithTooltip";
import { formatFecha } from "@/utils/formatFecha";
import { formatId } from "@/utils/formatId";
import { useNavigate } from "react-router-dom";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as xlsx from "node-xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

const trabajosColumns = [
  { name: "ID", uuid: "id_orden_trabajo" },
  { name: "Código", uuid: "codigo" },
  { name: "Fecha", uuid: "fecha_asignacion" },
  { name: "Creado por", uuid: "jefe_asigna" },
  { name: "Estado", uuid: "estado" },
];

const trabajosFilters = [
  // Aquí se pueden agregar filtros si es necesario
];

const TrabajosAsignados = () => {
  const navigate = useNavigate();
  const listPageRefetchRef = useRef(null);

  const onDetailCode = (data) => {
    navigate(
      `/trabajos-asignados/${data.id_orden_trabajo}/detalle-codigo`,
      data
    );
  };

  const render = {
    id_orden_trabajo: (row) => formatId(row.id_orden_trabajo),
    codigo: (row) => (
      <button
        className="transition-colors duration-300 hover:underline hover:text-[var(--button-hover-bg)]"
        onClick={() => onDetailCode(row)}
      >
        {row.codigo ? row.codigo : "Sin código"}
      </button>
    ),
    fecha_asignacion: (row) => formatFecha(row.fecha_asignacion),
    orden_trabajo_usuario: (row) => {
      const responsable =
        row.orden_trabajo_usuario &&
        row.orden_trabajo_usuario.find((u) => u.rol_en_orden === "Responsable");
      return responsable
        ? responsable.usuario.nombre_completo
        : "Sin responsable";
    },
    jefe_asigna: (row) => {
      const jefe = row.jefe_asigna && row.jefe_asigna.nombre_completo;
      return jefe ? jefe : "Sin jefe";
    },
    // row.jefe_asigna ? (
    //   <UserAvatarRowTooltip
    //     user={row.jefe_asigna}
    //     size={40}
    //     tooltipSize={60}
    //   />
    // ) : (
    //   "-"
    // ),
  };

  // Función personalizada para exportar a Excel evitando [object Object] en "Responsable"
  const customExportToExcel = (data, columns, title) => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const header = trabajosColumns.map((col) => col.name);
    const body = data.map((row) =>
      trabajosColumns.map((col) => {
        if (col.uuid === "orden_trabajo_usuario") {
          const responsable =
            row.orden_trabajo_usuario &&
            row.orden_trabajo_usuario.find(
              (u) => u.rol_en_orden === "Responsable"
            );
          return responsable
            ? responsable.usuario.nombre_completo
            : "Sin responsable";
        }
        if (typeof row[col.uuid] === "object" && row[col.uuid] !== null) {
          return row[col.uuid].nombre_completo || JSON.stringify(row[col.uuid]);
        }
        return row[col.uuid] || "N/A";
      })
    );
    const sheetData = [header, ...body];
    const buffer = xlsx.build([{ name: title, data: sheetData }]);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${title}.xlsx`);
  };

  return (
    <ListPage
      useFetchHook={useTrabajosAsignados}
      columns={trabajosColumns}
      filterFields={trabajosFilters}
      title="Trabajos Asignados"
      createButton={<></>}
      onRefetch={(refetchFunc) => {
        if (typeof refetchFunc === "function") {
          listPageRefetchRef.current = refetchFunc;
        }
      }}
      render={render}
      onExportExcel={customExportToExcel}
      // Si deseas, puedes pasar también una función personalizada para PDF:
      // onExportPDF={customExportToPDF}
      showExportButtons={true}
    />
  );
};

export default TrabajosAsignados;
