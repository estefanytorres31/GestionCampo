import useFetchData from "../useFetchData"; // Ajusta la ruta según tu estructura

const useTrabajosAsignados = (filters, page = 1, pageSize = 99) => {
  return useFetchData("/ordenestrabajo/web", filters, page, pageSize);
};

export default useTrabajosAsignados;
