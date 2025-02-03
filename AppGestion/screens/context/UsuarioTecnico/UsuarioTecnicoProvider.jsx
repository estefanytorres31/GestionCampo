import React, { useContext, useState, useEffect } from 'react';
import UsuarioTecnicoContext from "./UsuarioTecnicoContext";
import AuthContext from "../Auth/AuthContext";
import { getAllUsuariosByRol } from "../../services/UsuarioService";

const UsuarioTecnicoProvider = ({ children }) => {
    const [usuariosTecnicos, setUsuariosTecnicos] = useState([]);
    const { isAuth } = useContext(AuthContext);

    useEffect(() => {
        if (isAuth) {
            const fetchUsuariosTecnicos = async () => {
                try {
                    const response = await getAllUsuariosByRol(3); // Rol técnico = 1
                    if (response) {
                        setUsuariosTecnicos(response.data);
                        console.log('Usuarios técnicos cargados correctamente:', response.data);
                    } else {
                        console.log('No se encontraron usuarios técnicos.');
                    }
                } catch (error) {
                    console.error('Error al cargar usuarios técnicos:', error);
                }
            };
            fetchUsuariosTecnicos();
        }
    }, [isAuth]);

    return (
        <UsuarioTecnicoContext.Provider value={{ usuariosTecnicos, setUsuariosTecnicos }}>
            {children}
        </UsuarioTecnicoContext.Provider>
    );
};

export default UsuarioTecnicoProvider;
