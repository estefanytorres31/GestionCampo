import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const response = await axiosInstance.get("/asistencia/view");
        setAsistencias(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al obtener asistencias.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, []);

  return { asistencias, loading, error };
};

export default useAsistencias;
