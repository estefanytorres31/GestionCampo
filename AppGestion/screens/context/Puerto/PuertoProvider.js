import React, { useState, useEffect } from 'react';
import PuertoContext from "./PuertoContext";
import { getAllPuertos } from "../../services/PuertoService";

const PuertoProvider = ({ children }) => {
    const [puertos, setPuertos] = useState([]);

    useEffect(() => {
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
    }, []);

    return (
        <PuertoContext.Provider value={{ puertos, setPuertos }}>
            {children}
        </PuertoContext.Provider>
    );
};

export default PuertoProvider;
