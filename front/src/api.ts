import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // Asegúrate que sea el puerto que elegiste
});

export default api;
