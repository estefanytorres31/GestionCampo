import { useState, useEffect } from "react";
import { getEmbarcacionesByEmpresa } from "../../services/EmbarcacionService";
import EmbarcacionContext from "./EmbarcacionContext";

export const EmbarcacionProvider = ({ children }) => {
    const [embarcaciones, setEmbarcaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmbarcacionesByEmpresa = async (empresa_id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEmbarcacionesByEmpresa(empresa_id);
            setEmbarcaciones(data);
            console.log(data);
            return data;
        } catch (err) {
            setError(err.message || "Error al cargar las embarcaciones");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearEmbarcaciones = () => {
        setEmbarcaciones([]);
        setError(null);
    };

    const value = {
        embarcaciones,
        loading,
        error,
        fetchEmbarcacionesByEmpresa,
        clearEmbarcaciones
    };

    return (
        <EmbarcacionContext.Provider value={value}>
            {children}
        </EmbarcacionContext.Provider>
    );
};

export default EmbarcacionProvider;