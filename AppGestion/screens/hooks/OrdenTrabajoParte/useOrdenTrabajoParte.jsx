import OrdenTrabajoParteContext from "../../context/OrdenTrabajoParte/OrdenTrabajoParteContext";
import { useContext } from "react";

const useOrdenTrabajoParte = () =>  useContext(OrdenTrabajoParteContext);

export default useOrdenTrabajoParte;

