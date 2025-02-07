import React from "react";
import { useParams } from "react-router-dom";
import useTrabajosAsignados from "@/hooks/trabajosAsignados/useTrabajosAsignados";
const DetallePuerto = ({ puerto }) => {
  return (
    <div className="w-[80%] flex flex-col items-center border-2 rounded-3xl p-16 my-4 border-[#5a1fd0]">
      <h1 className="h1-jetbrains text-white">Detalle del Puerto</h1>
      <p className="p-jetbrains text-white">
        {puerto?.nombre
          ? `Puerto: ${puerto.nombre}`
          : "Información no disponible"}
      </p>
    </div>
  );
};
const DetalleEmbarcacion = ({ embarcacion }) => {
  return (
    <div className="w-[80%] flex flex-col items-center border-2 rounded-3xl p-16 my-4 border-[#5a1fd0]">
      <h1 className="h1-jetbrains text-white">Detalle de la Embarcación</h1>
      <p className="p-jetbrains text-white">
        {embarcacion?.nombre
          ? `Nombre: ${embarcacion.nombre}`
          : "Información no disponible"}
      </p>
    </div>
  );
};
const DetalleEmpresa = ({ jefe_asigna, tipo_trabajo }) => {
  return (
    <div className="w-[80%] flex flex-col items-center border-2 rounded-3xl p-16 my-4 border-[#5a1fd0]">
      <h1 className="h1-jetbrains text-white">Detalle de la Empresa</h1>
      {jefe_asigna ? (
        <>
          <p className="p-jetbrains text-white">
            <strong>Jefe Asigna:</strong> {jefe_asigna.nombre_completo}
          </p>
          <p className="p-jetbrains text-white">
            <strong>Usuario:</strong> {jefe_asigna.nombre_usuario}
          </p>
          <p className="p-jetbrains text-white">
            <strong>Email:</strong> {jefe_asigna.email}
          </p>
        </>
      ) : (
        <p className="p-jetbrains text-white">
          Información del jefe asignador no disponible
        </p>
      )}
      {tipo_trabajo && (
        <p className="p-jetbrains text-white">
          <strong>Tipo de trabajo:</strong> {tipo_trabajo.nombre_trabajo}
        </p>
      )}
    </div>
  );
};
const CodigoDetalle = () => {
  const { id_orden_trabajo } = useParams();
  const {
    data: codigoDetalle,
    loading,
    error,
  } = useTrabajosAsignados({ id_orden_trabajo });

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error al cargar el detalle.</div>;

  // Suponemos que el hook devuelve un arreglo; usamos el primer objeto.
  const detalle = codigoDetalle && codigoDetalle[0];

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center py-8">
      <h2 className="h2-jetbrains text-white mb-4">{codigoDetalle.codigo}</h2>
      {detalle ? (
        <>
          <DetalleEmbarcacion embarcacion={detalle.embarcacion} />
          <DetallePuerto puerto={detalle.puerto} />
          <DetalleEmpresa
            jefe_asigna={detalle.jefe_asigna}
            tipo_trabajo={detalle.tipo_trabajo}
          />
        </>
      ) : (
        <div className="p-8 text-white">
          No se encontró información para este código.
        </div>
      )}
    </div>
  );
};

export default CodigoDetalle;
