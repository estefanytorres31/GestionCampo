import { useContext } from "react";
import EmpresaContext from "../../context/Empresa/EmpresaContext";

const useAuth=()=>useContext(EmpresaContext);

export default useAuth;