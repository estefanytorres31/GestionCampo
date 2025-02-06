import useFetchData from "../useFetchData"; // Ajusta la ruta según tu estructura

const useTrabajosAsignados = (filters, page, pageSize) => {
  return useFetchData("/ordenestrabajo/web?id_jefe_asigna=1", filters, page, pageSize);
};

export default useTrabajosAsignados;
