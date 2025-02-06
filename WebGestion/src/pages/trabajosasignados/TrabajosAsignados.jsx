import React, { useState, useEffect, useRef } from "react";
import ListPage from "@/components/ListPage";
import useTrabajosAsignados from "@/hooks/trabajosAsignados/useTrabajosAsignados"; // Ajusta la ruta
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

// Define las columnas para la tabla de Trabajos Asignados
const trabajosColumns = [
  { name: "ID", uuid: "id_orden_trabajo" },
  { name: "Embarcación", uuid: "embarcacion" },
  { name: "Puerto", uuid: "puerto" },
  { name: "Tipo de Trabajo", uuid: "tipo_trabajo" },
  { name: "Estado", uuid: "estado" },
  { name: "Código", uuid: "codigo" },
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
