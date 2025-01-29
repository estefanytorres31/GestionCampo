import { useContext } from "react";
import TipoTrabajoContext from "../../context/TipoTrabajo/TipoTrabajoContext";

const useTipoTrabajo=()=>useContext(TipoTrabajoContext);

export default useTipoTrabajo;