import { useContext } from "react";
import AuthContext from "../../context/Auth/AuthContext";

const useAuth=()=>useContext(AuthContext);

export default useAuth;