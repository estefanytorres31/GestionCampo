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
            // First attempt login
            const { status, data } = await login(username, password);
            
            if (status !== 200 || !data?.token) {
                throw new Error('Invalid credentials');
            }

            const { userId, token } = data;

            // Store auth data
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem("userId", userId.toString());
            
            try {
                // Attempt to get user data
                const userData = await getUserById(userId);
                setUser(userData);
                //setRole(userData.rol);
            } catch (userError) {
                // If we can't get user data, we'll still consider them logged in
                // but with minimal user data
                console.warn('Could not fetch full user data:', userError);
                setUser({
                    id: userId,
                    username: data.nombreUsuario
                });
            }

            // Set authenticated regardless of user data fetch
            setIsAuth(true);
            return { status, data };

        } catch (error) {
            setIsAuth(false);
            setUser(null);
            setRole(null);
            
            if (error.message === 'Invalid credentials') {
                setError('Usuario o contraseña incorrectos');
                return { status: 401, data: null };
            }
            
            setError('Error al iniciar sesión');
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