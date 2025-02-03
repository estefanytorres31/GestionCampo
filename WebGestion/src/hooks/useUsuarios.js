import useFetchData from "./useFetchData";

const useUsuarios = (filters, page, pageSize) => {
  return useFetchData("/usuario", filters, page, pageSize);
};

export default useUsuarios;
