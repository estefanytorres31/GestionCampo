import React, { useState, useEffect, useRef } from "react";
import ListPage from "@/components/ListPage";
import useTrabajosAsignados from "@/hooks/trabajosAsignados/useTrabajosAsignados";
import UserAvatarRowTooltip from "@/components/UserAvatarWithTooltip";

// Define las columnas para la tabla de Trabajos Asignados
const trabajosColumns = [
  { name: "ID", uuid: "id_orden_trabajo" },
  { name: "Código", uuid: "codigo" },
  { name: "Asignado por", uuid: "jefe_asigna" },
  { name: "Tipo de Trabajo", uuid: "tipo_trabajo" },
  { name: "Embarcación", uuid: "embarcacion" },
  { name: "Puerto", uuid: "puerto" },
  { name: "Estado", uuid: "estado" },
];

// Opcional: Si deseas agregar filtros, puedes definirlos aquí.
const trabajosFilters = [
  // Ejemplo: filtrar por estado
  // {
  //   key: "codigo",
  //   type: "text",
  //   placeholder: "Filtrar por codigo",
  //   // icon: <IconComponent />, // si tienes un ícono
  // },
];

const TrabajosAsignados = () => {
  const [filters, setFilters] = useState(
    trabajosFilters.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const listPageRefetchRef = useRef(null);

  const render = {
    embarcacion: (row) =>
      row.embarcacion && row.embarcacion.nombre ? row.embarcacion.nombre : "-",
    puerto: (row) =>
      row.puerto && row.puerto.nombre ? row.puerto.nombre : "-",
    tipo_trabajo: (row) =>
      row.tipo_trabajo && row.tipo_trabajo.nombre_trabajo
        ? row.tipo_trabajo.nombre_trabajo
        : "-",
    jefe_asigna: (row) =>
      row.jefe_asigna ? (
        <div className="flex items-center gap-2 w-full justify-center">
          <UserAvatarRowTooltip
            user={row.jefe_asigna}
            size={40}
            tooltipSize={60}
          />
        </div>
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
