import { useContext, useState, useEffect } from "react";
import AsistenciaContext from "../../context/Asistencia/AsistenciaContext";

const useAsistencia=()=>useContext(AsistenciaContext);


export default useAsistencia;
