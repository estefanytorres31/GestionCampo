import React, { useContext, useState, useEffect } from 'react';
import UsuarioTecnicoContext from "./UsuarioTecnicoContext";
import AuthContext from "../Auth/AuthContext";
import { getAllUsuariosByRol, getUserById } from "../../services/UsuarioService";

const UsuarioTecnicoProvider = ({ children }) => {
    const [usuariosTecnicos, setUsuariosTecnicos] = useState([]);
    const { isAuth } = useContext(AuthContext);

    useEffect(() => {
        if (isAuth) {
            const fetchUsuariosTecnicos = async () => {
                try {
                    const response = await getAllUsuariosByRol(2); // Rol técnico = 1
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

    const getUsuarioById = async (id_usuario) => {
        try{
            const response = await getUserById(id_usuario);
            if (response) {
                return response.data;
            } else {
                console.log('No se encontró el usuario técnico con el id:', id_usuario);
                return null;
            }
            
        }catch (error) {
            console.error('Error al obtener usuario técnico:', error);
            return null;
        }

    }

    return (
        <UsuarioTecnicoContext.Provider value={{ usuariosTecnicos, setUsuariosTecnicos, getUsuarioById }}>
            {children}
        </UsuarioTecnicoContext.Provider>
    );
};

export default UsuarioTecnicoProvider;
