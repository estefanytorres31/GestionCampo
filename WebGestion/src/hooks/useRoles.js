import useFetchData from "./useFetchData";

const useUsuarios = (filters, page, pageSize) => {
  return useFetchData("/roles", filters, page, pageSize);
};

export default useUsuarios;
