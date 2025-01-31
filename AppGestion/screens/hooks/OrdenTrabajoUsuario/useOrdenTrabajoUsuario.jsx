import OrdenTrabajoUsuarioContext from "../../context/OrdenTrabajoUsuario/OrdenTrabajoUsuarioContext";
import { useContext } from "react";

const useOrdenTrabajoUsuario = () =>  useContext(OrdenTrabajoUsuarioContext);

export default useOrdenTrabajoUsuario;

