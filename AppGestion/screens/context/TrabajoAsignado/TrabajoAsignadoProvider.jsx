import React, { useState, useEffect } from "react";
import TrabajoAsignadoContext from "./TrabajoAsignadoContext";
import apiClient from "../../API/apiClient";
import useAuth from "../../hooks/Auth/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useOrdenTrabajoUsuario from "../../hooks/OrdenTrabajoUsuario/useOrdenTrabajoUsuario";

const TrabajoAsignadoProvider = ({ children }) => {
    const {isAuth}=useAuth();
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isResponsable, setIsResponsable] = useState(false);
    const { getOrdenTrabajoUsuarioByUsuario }=useOrdenTrabajoUsuario();

    const checkUserRole = async () => {
        try {
          const response = await getOrdenTrabajoUsuarioByUsuario();
          const hasResponsableRole = response.some(
            assignment => assignment.rol_en_orden === "Responsable"
          );
          setIsResponsable(hasResponsableRole);
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      };

    // Función para obtener los trabajos asignados al usuario
    const fetchTrabajosAsignados = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = await AsyncStorage.getItem("userId");
            const userIdInt = parseInt(userId, 10);
    
            // 🔍 Obtener asignaciones de órdenes de trabajo
            const ordenesResponse = await apiClient.get(`/ordenestrabajousuario?rol_en_orden=Responsable&id_usuario=${userIdInt}`);
    
            if (!ordenesResponse.data || !Array.isArray(ordenesResponse.data.data)) {
                throw new Error("La respuesta de órdenes de trabajo no es válida");
            }
    
            const ordenesIds = ordenesResponse.data.data.map(orden => orden.id_orden_trabajo);
    
            if (ordenesIds.length === 0) {
                console.warn("No hay órdenes de trabajo asignadas.");
                setTrabajos([]);
                setLoading(false);
                return;
            }
    
            // 🔍 Obtener detalles de cada orden de trabajo
            const ordenesPromises = ordenesIds.map(async (id) => {
                try {
                    const response = await apiClient.get(`/ordenestrabajo/${id}`);
                    return response.data.data;
                } catch (error) {
                    console.error(`Error obteniendo orden de trabajo con ID ${id}:`, error.response?.data || error.message);
                    return null;
                }
            });
    
            const ordenesData = await Promise.all(ordenesPromises);
            const ordenesValidas = ordenesData.filter(orden => orden !== null);
    
            if (ordenesValidas.length === 0) {
                console.warn("No se encontraron órdenes de trabajo válidas.");
                setTrabajos([]);
                setLoading(false);
                return;
            }
    
            // 🔍 Obtener los tipos de trabajo (Corrección aquí)
            const tiposPromises = ordenesValidas.map(async (orden) => {
                try {
                    const response = await apiClient.get(`/tipotrabajo/${orden.id_tipo_trabajo}`);
                    return response.data;  // ✅ Retorna todo el objeto, no solo `data`
                } catch (error) {
                    console.error(`Error obteniendo tipo de trabajo con ID ${orden.id_tipo_trabajo}:`, error.response?.data || error.message);
                    return { data: { nombre_trabajo: "Tipo de trabajo desconocido" } }; // Corrección aquí
                }
            });
    
            const tiposData = await Promise.all(tiposPromises);
    
            // 🔍 Construir la lista de trabajos asignados (Corrección aquí)
            const trabajosAsignados = ordenesValidas.map((orden, index) => ({
                id_orden_trabajo: orden.id_orden_trabajo,
                nombre_trabajo: tiposData[index]?.data?.nombre_trabajo || "Desconocido",  // ✅ Corrección en el acceso
                estado: orden.estado,
            }));
    
            setTrabajos(trabajosAsignados);
        } catch (err) {
            console.error("Error obteniendo trabajos asignados:", err);
            setError("Error al cargar los trabajos.");
        } finally {
            setLoading(false);
        }
    };
    
    
    

    // Ejecutar la carga de trabajos al montar el provider
    useEffect(() => {
        if (isAuth 
            && isResponsable
        ) {
            fetchTrabajosAsignados();
        }
    }, [isAuth]);

    return (
        <TrabajoAsignadoContext.Provider value={{ trabajos, loading, error, fetchTrabajosAsignados }}>
            {children}
        </TrabajoAsignadoContext.Provider>
    );
};

export default TrabajoAsignadoProvider;
