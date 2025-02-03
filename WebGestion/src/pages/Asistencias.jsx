import useAsistencias from "../hooks/useAsistencias";
import ListPage from "../components/ListPage";
import { BsSearch } from "react-icons/bs";

const asistenciasColumns = [
  { name: "ID", uuid: "id" },
  { name: "Nombre", uuid: "nombre_completo" },
  { name: "Fecha", uuid: "fecha" },
  { name: "Entrada", uuid: "fecha_hora_entrada" },
  { name: "Salida", uuid: "fecha_hora_salida" },
  { name: "Latitud", uuid: "latitud" },
  { name: "Longitud", uuid: "longitud" },
  { name: "Embarcación", uuid: "embarcacion" },
  { name: "Horas Trabajadas", uuid: "horas_trabajo" },
];

const asistenciasFilters = [
  { key: "nombre_completo", type: "text", placeholder: "Buscar por nombre", icon: <BsSearch className="text-gray-400" /> },
  { key: "fecha", type: "date", placeholder: "Fecha de entrada" },
  { key: "nombre_embarcacion", type: "text", placeholder: "Buscar por Embarcación", icon: <BsSearch className="text-gray-400" /> },
];

export const Asistencias = () => {
  return <ListPage useFetchHook={useAsistencias} columns={asistenciasColumns} filterFields={asistenciasFilters} title="Asistencias" />;
};