import useFetchData from "../useFetchData";

const usePermisos = (filters, page, pageSize) => {
  return useFetchData("/permiso", filters, page, pageSize);
};

export default usePermisos;
