import React from "react";
import Mapa from "./Mapa";
import useMapaData from "@/hooks/asistencias/useMapaData";

const Dashboard = () => {
  const { data, loading, error } = useMapaData();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full">
      <Mapa asistencias={data} />
    </div>
  );
};

export default Dashboard;
