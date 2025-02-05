// src/hooks/useMapaData.js
import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosConfig";

const useMapaData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapaData = async () => {
      try {
        const response = await axiosInstance.get("/asistencia", {
          params: {
            nombre_completo: "",
            fecha: "",
            nombre_embarcacion: "",
            page: 1,
            pageSize: 100,
          },
        });
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapaData();
  }, []);

  return { data, loading, error };
};

export default useMapaData;
