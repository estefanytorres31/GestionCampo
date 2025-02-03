import { useEffect, useState, useMemo } from "react";
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

  // 🔹 Memoizar `filters` para evitar recreaciones innecesarias
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(endpoint, {
          params: { ...stableFilters, page, pageSize },
        });

        console.log("Fetching data...");
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

    fetchData();
  }, [endpoint, stableFilters, page, pageSize]); // 🔹 Ahora `filters` es estable

  return { data, loading, error, pagination };
};

export default useFetchData;
