import useFetchData from "../useFetchData";

const useAsistencias = (filters, page, pageSize) => {
  return useFetchData("/asistencia", filters, page, pageSize);
};

export default useAsistencias;
