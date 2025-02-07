import { useParams } from "react-router-dom";
import useTrabajosAsignados from "@/hooks/trabajosAsignados/useTrabajosAsignados";
import FlowDiagram from "@/components/FlowDiagram";

const CodigoDetalle = () => {
  const { id_orden_trabajo } = useParams();
  const {
    data: codigoDetalle,
    loading,
    error,
  } = useTrabajosAsignados({ id_orden_trabajo });

  if (loading)
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="span-jetbrains ml-3 text-[--primary-text]">Cargando datos...</span>
      </div>
    );
  if (error)
    return <div className="p-8 text-red-500">Error al cargar el detalle.</div>;

  const detalle = codigoDetalle && codigoDetalle[0];
  if (!detalle)
    return <div className="p-8 text-[--primary-text]">No se encontró información.</div>;

  return (
    // Usamos h-screen para que ocupe la altura de la ventana y overflow-hidden para evitar scroll
    <div className="w-full h-screen bg-[--secondary-bg] overflow-hidden">
      <FlowDiagram detalle={detalle} />
    </div>
  );
};

export default CodigoDetalle;
