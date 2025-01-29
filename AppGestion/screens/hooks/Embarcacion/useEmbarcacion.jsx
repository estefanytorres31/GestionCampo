import { useContext } from "react";
import EmbarcacionContext from "../../context/Embarcacion/EmbarcacionContext";

const useEmbarcacion=()=>useContext(EmbarcacionContext);

export default useEmbarcacion;