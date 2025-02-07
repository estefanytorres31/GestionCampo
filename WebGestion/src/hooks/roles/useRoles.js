import useFetchData from "../useFetchData";

const useRoles = (filters, page, pageSize) => {
  return useFetchData("/rol", filters, page, pageSize);
};

export default useRoles;