import { useEffect, useState, useCallback, useMemo } from "react";
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

  // Se utiliza JSON.stringify para "estabilizar" el objeto filters.
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint, {
        params: { ...memoizedFilters, page, pageSize },
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
  }, [endpoint, memoizedFilters, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, pagination, refetch: fetchData };
};

export default useFetchData;
