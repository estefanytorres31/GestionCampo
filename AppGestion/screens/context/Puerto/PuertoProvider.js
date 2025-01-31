import React, { useState, useEffect, useContext } from 'react';
import PuertoContext from "./PuertoContext";
import { getAllPuertos } from "../../services/PuertoService";
import AuthContext from '../Auth/AuthContext';

const PuertoProvider = ({ children }) => {
    const [puertos, setPuertos] = useState([]);
    const {isAuth}=useContext(AuthContext)
    useEffect(() => {
        if(isAuth) {
            const fetchPuertos = async () => {
                try {
                    const response = await getAllPuertos();
                    if (response.data) {
                        setPuertos(response.data);
                    } else {
                        console.log('No se encontraron puertos.');
                    }
                } catch (error) {
                    console.error('Error al cargar los puertos:', error);
                }
            };
    
            fetchPuertos();
        }
    }, [isAuth]);

    return (
        <PuertoContext.Provider value={{ puertos, setPuertos }}>
            {children}
        </PuertoContext.Provider>
    );
};

export default PuertoProvider;
