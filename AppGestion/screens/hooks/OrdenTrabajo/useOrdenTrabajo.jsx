import OrdenTrabajoContext from "../../context/OrdenTrabajo/OrdenTrabajoContext";
import { useContext } from "react";

const useOrdenTrabajo = () =>  useContext(OrdenTrabajoContext);

export default useOrdenTrabajo;

