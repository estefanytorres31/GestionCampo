import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

const useFetchData = (endpoint, filters = {}, page = 1, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page,
    pageSize,
    totalPages: 0,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Validamos que los filtros tengan al menos 3 caracteres antes de hacer la petición
      const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value.length >= 3 || value === "") {
          acc[key] = value;
        }
        return acc;
      }, {});

      if (Object.keys(validFilters).length > 0) {
        fetchData(validFilters);
      }
    }, 1000); // 1 segundo de debounce

    return () => clearTimeout(timeoutId);
  }, [endpoint, filters, page, pageSize]);

  const fetchData = async (validFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(endpoint, {
        params: { ...validFilters, page, pageSize },
      });

      setData(response.data.data);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError(err.response?.data?.message || `Error al obtener datos de ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, pagination };
};

export default useFetchData;
