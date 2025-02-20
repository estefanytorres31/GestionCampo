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
                    
                    if (response) {

                        setEmpresas(response.data);
                    } else {
                        console.log('No se encontraron empresas.');
                    }
                } catch (error) {
                    console.error('Error en el fetch:', error);
                }
            };
            
        getEmpresas();
    }
    }, [isAuth]);

    return (
        <EmpresaContext.Provider value={{ empresas, setEmpresas }}>
            {children}
        </EmpresaContext.Provider>
    );
}

export default EmpresaProvider;