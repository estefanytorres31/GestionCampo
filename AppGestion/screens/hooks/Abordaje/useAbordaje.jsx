import { useContext, useState, useEffect } from "react";
import AbordajeContext from "../../context/Abordaje/AbordajeContext";

const useAbordaje=()=>useContext(AbordajeContext);


export default useAbordaje;
