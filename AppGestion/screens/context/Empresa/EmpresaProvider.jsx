import React, { useContext, useState, useEffect } from 'react';
import { getAllEmpresas } from '../../services/EmpresaService';
import EmpresaContext from './EmpresaContext';
import AuthContext from '../Auth/AuthContext';


const EmpresaProvider = ({ children }) => {
    const [empresas, setEmpresas] = useState([]);
    const {isAuth}=useContext(AuthContext);

    useEffect(() => {
        if(isAuth){
            const getEmpresas = async () => {
                try {
                    const response = await getAllEmpresas();
                    console.log('Respuesta de getAllEmpresas:', response);
                    
                    if (response && response.length > 0) {
                        setEmpresas(response);
                    } else {
                        console.log('No se encontraron empresas.');
                    }
                } catch (error) {
                    console.error('Error en el fetch:', error);
                }
            };
            
        getEmpresas();
    }
    }, []);

    return (
        <EmpresaContext.Provider value={{ empresas, setEmpresas }}>
            {children}
        </EmpresaContext.Provider>
    );
}

export default EmpresaProvider;