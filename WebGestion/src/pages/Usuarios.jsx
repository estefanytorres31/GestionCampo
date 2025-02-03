import useUsuarios from "../hooks/useUsuarios";
import ListPage from "../components/ListPage";
import { BsSearch } from "react-icons/bs";

const usuariosColumns = [
  { name: "ID", uuid: "id" },
  { name: "Usuario", uuid: "nombre_usuario" },
  { name: "Nombre Completo", uuid: "nombre_completo" },
  { name: "Email", uuid: "email" },
  { name: "Creado En", uuid: "creado_en" },
];

const usuariosFilters = [
  { key: "nombre_usuario", type: "text", placeholder: "Buscar usuario", icon: <BsSearch className="text-gray-400" /> },
  { key: "nombre_completo", type: "text", placeholder: "Buscar nombre completo" },
  { key: "email", type: "text", placeholder: "Buscar por email" },
];

export const Usuarios = () => {
  return <ListPage useFetchHook={useUsuarios} columns={usuariosColumns} filterFields={usuariosFilters} title="Usuarios" />;
};
