import React, { useState, useRef } from "react";
import ListPage from "@/components/ListPage";
import useTrabajosAsignados from "@/hooks/trabajosAsignados/useTrabajosAsignados";
import UserAvatarRowTooltip from "@/components/UserAvatarWithTooltip";
import { formatFecha } from "@/utils/formatFecha";
import { formatId } from "@/utils/formatId";
import { useNavigate } from "react-router-dom";

// Define las columnas para la tabla de Trabajos Asignados
const trabajosColumns = [
  { name: "ID", uuid: "id_orden_trabajo" },
  { name: "Código", uuid: "codigo" },
  { name: "Fecha", uuid: "fecha_asignacion" },
  { name: "Asignado por", uuid: "jefe_asigna" },
  { name: "Responsable", uuid: "orden_trabajo_usuario" },
  { name: "Estado", uuid: "estado" },
];

// Opcional: Si deseas agregar filtros, puedes definirlos aquí.
const trabajosFilters = [
  // Ejemplo: filtrar por algún campo
  // {
  //   key: "codigo",
  //   type: "text",
  //   placeholder: "Filtrar por código",
  // },
];

const TrabajosAsignados = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(
    trabajosFilters.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const listPageRefetchRef = useRef(null);

  const onDetailCode = (data) => {
    navigate(`/trabajos-asignados/${data.id_orden_trabajo}/detalle-codigo`, data);
  };

  const render = {
    id_orden_trabajo: (row) => formatId(row.id_orden_trabajo),
    codigo: (row) => (
      <button className="underline" onClick={() => onDetailCode(row)}>
        {row.codigo ? row.codigo : "Sin código"}
      </button>
    ),
    fecha_asignacion: (row) => formatFecha(row.fecha_asignacion),
    orden_trabajo_usuario: (row) => {
      const responsable =
        row.orden_trabajo_usuario &&
        row.orden_trabajo_usuario.find((u) => u.rol_en_orden === "Responsable");
      return responsable ? (
        <UserAvatarRowTooltip
          user={responsable.usuario}
          size={40}
          tooltipSize={60}
        />
      ) : (
        "Sin responsable"
      );
    },
    jefe_asigna: (row) =>
      row.jefe_asigna ? (
        <UserAvatarRowTooltip user={row.jefe_asigna} size={40} tooltipSize={60} />
      ) : (
        "-"
      ),
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
    />
  );
};

export default TrabajosAsignados;
