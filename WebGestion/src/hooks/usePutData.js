import { useState, useCallback } from "react";
import axiosInstance from "../config/axiosConfig";

const usePutData = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const putData = useCallback(
    async (data) => {
      if (!endpoint) return; // Evita ejecutar si no hay endpoint
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.put(endpoint, data);
        setResponse(res.data);
        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message || `Error al actualizar datos en ${endpoint}`;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { putData, response, loading, error };
};

export default usePutData;
