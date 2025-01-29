import React, { useContext, useState, useEffect, Children } from 'react';
import TipoTrabajoContext from "./TipoTrabajoContext";
import AuthContext from "../Auth/AuthContext";
import {getAllTipoTrabajo} from "../../services/TipoTrabajoService";

const TipoTrabajoProvider=({children})=>{
    const [tipotrabajos, setTipoTrabajos]=useState([]);
    const {isAuth}=useContext(AuthContext)

    useEffect(()=>{
        if(isAuth){
            const fetchTipoTrabajos=async ()=>{
                try{
                    const response=await getAllTipoTrabajo();
                    console.log(response)
                    if (response) {
                        setTipoTrabajos(response.data);
                        console.log('Tipos de trabajo cargados correctamente.', response);
                    } else {
                        console.log('No se encontraron tipos de trabajo.');
                    }
                }catch(error){
                    console.error(error);
                }
            }
            fetchTipoTrabajos();
        }
    }, [isAuth]);
    
    return(
        <TipoTrabajoContext.Provider value={{tipotrabajos, setTipoTrabajos}}>
            {children}
        </TipoTrabajoContext.Provider>
    );
}

export default TipoTrabajoProvider;
