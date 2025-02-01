import React, { useContext, useState, useEffect, Children } from 'react';
import TipoTrabajoContext from "./TipoTrabajoContext";
import AuthContext from "../Auth/AuthContext";
import {getAllTipoTrabajo, getTipoTrabajoById } from "../../services/TipoTrabajoService";

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

    const getTipoTrabajoPorID=async(id_tipo_trabajo)=>{
        try{
            const response=await getTipoTrabajoById(id_tipo_trabajo);
            return response.data;
        }catch(error){
            console.error("Error fetching tipo de trabajo: ", error);
        }
    }
    
    return(
        <TipoTrabajoContext.Provider value={{tipotrabajos, setTipoTrabajos, getTipoTrabajoPorID}}>
            {children}
        </TipoTrabajoContext.Provider>
    );
}

export default TipoTrabajoProvider;
