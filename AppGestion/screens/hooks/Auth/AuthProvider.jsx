import React, { useState } from 'react';
import AuthContext from './AuthContext';
import { login } from '../../services/AuthService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from '../../services/UsuarioService';

const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginAccess = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const { status, data } = await login(username, password);
            if (status === 200) {
                const { userId, token } = data;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem("userId", userId.toString());
                console.log("Token and UserId stored:", token, userId);
                setIsAuth(true);
                const userData = await getUserById(userId);
                setUser(userData);
                setRole(userData.rol);
                return { status, data };
            }
            setIsAuth(false);
            setUser(null);
            setRole(null);
            return { status, data };
        } catch (err) {
            setError("Error al iniciar sesión");
            setIsAuth(false);
            setUser(null);
            setRole(null);
            return { status: 500, data: null };
        } finally {
            setLoading(false);
        }
    };
    
    
    const logout = async () => {    
        try{
            const token = await AsyncStorage.getItem('token');
            if (token!==null){
                const response = await logout();
                if(response.status === 200){
                    await AsyncStorage.clear();
                    setIsAuth(false);
                    setUser(null);
                    setRole(null);
                    return true;
                }else{
                    setIsAuth(false);
                    setUser(null);
                    setRole(null);
                    return false;
                }
            }
        }catch(err){
            console.error(err);
            return false;
        }
    }
    
    return (
        <AuthContext.Provider value={{
            isAuth,
            user,
            role,
            loginAccess,
            logout,
            setLoading,
            setError,
            setIsAuth,
            setUser,
            setRole,
            setLoading,
            loading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;