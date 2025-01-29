import { useContext } from "react";
import EmpresaContext from "../../context/Empresa/EmpresaContext";

const useEmpresa=()=>useContext(EmpresaContext);

export default useEmpresa;