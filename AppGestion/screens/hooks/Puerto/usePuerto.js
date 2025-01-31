import { useContext } from "react";
import PuertoContext from "../../context/Puerto/PuertoContext";

const usePuerto = () => {
    return useContext(PuertoContext);
};

export default usePuerto;
