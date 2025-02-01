import OrdenTrabajoSistemaContext from "../../context/OrdenTrabajoSistema/OrdenTrabajoSistemaContext";
import { useContext } from "react";

const useOrdenTrabajoSistema = () =>  useContext(OrdenTrabajoSistemaContext);

export default useOrdenTrabajoSistema;

