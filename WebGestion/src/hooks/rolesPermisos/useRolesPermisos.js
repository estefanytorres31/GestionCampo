import useFetchData from "../useFetchData";

const useRolesPermisos = (filters, page, pageSize) => {
  return useFetchData("/rolespermisos/permisos", filters, page, pageSize);
};

export default useRolesPermisos;