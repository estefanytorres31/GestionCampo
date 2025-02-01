import { useContext } from "react"
import TrabajoAsignadoContext from "../../context/TrabajoAsignado/TrabajoAsignadoContext";
const useTrabajoAsignado = () => useContext(TrabajoAsignadoContext);

export default useTrabajoAsignado;