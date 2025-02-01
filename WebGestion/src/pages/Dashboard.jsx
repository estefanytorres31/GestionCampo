import React from "react";
import useAsistencias from "../hooks/useAsistencias";
import { Table } from "../components/Table";

export const Dashboard = ({ params }) => {
  const { asistencias, loading, error } = useAsistencias();

  const columns = [
    { name: "ID", uuid: "id_entrada" },
    { name: "Nombre", uuid: "nombre_completo" },
    { name: "Fecha", uuid: "fecha" },
    { name: "Entrada", uuid: "fecha_hora_entrada" },
    { name: "Salida", uuid: "fecha_hora_salida" },
    { name: "Latitud", uuid: "latitud" },
    { name: "Longitud", uuid: "longitud" },
    { name: "Embarcación", uuid: "embarcacion" },
    { name: "Horas Trabajadas", uuid: "horas_trabajo" },
  ];

  if (loading) return <p>Cargando asistencias...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">Asistencias</h1> */}
      <Table columns={columns} data={asistencias} />
    </div>
  );
};
