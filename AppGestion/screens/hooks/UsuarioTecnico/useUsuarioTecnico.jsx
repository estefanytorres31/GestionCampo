import { useContext } from "react";
import UsuarioTecnicoContext from "../../context/UsuarioTecnico/UsuarioTecnicoContext";

const useUsuarioTecnico = () => {
    return useContext(UsuarioTecnicoContext);
};

export default useUsuarioTecnico;
