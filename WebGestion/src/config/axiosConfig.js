import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// const BASE_URL = import.meta.env.VITE_API_URL || "https://api-campo.peru-controls.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Tiempo de espera de 10 segundos
  withCredentials: true, // Enviar cookies al backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
