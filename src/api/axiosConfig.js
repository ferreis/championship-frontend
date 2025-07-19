// src/api/axiosConfig.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5110/api", // Endereço base do seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
