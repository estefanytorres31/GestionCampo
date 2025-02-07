// useThemeUser.js
import { useState, useCallback } from "react";
import axiosInstance from "../../config/axiosConfig";

const useThemeUser = (endpoint = "/theme") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const updateTheme = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.post(endpoint, data);
        setResponse(res.data);
        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message || `Error al enviar datos a ${endpoint}`;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { updateTheme, response, loading, error };
};

export default useThemeUser;
