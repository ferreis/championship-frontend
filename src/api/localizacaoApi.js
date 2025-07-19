// src/api/localizacaoApi.js
import apiClient from "./axiosConfig";

// --- PAÍS ---
export const getPaises = () => apiClient.get("/pais");
export const createPais = (data) => apiClient.post("/pais", data);
export const updatePais = (id, data) => apiClient.patch(`/pais/${id}`, data);
export const deletePais = (id) => apiClient.delete(`/pais/${id}`);

// --- ESTADO ---
export const getEstados = () => apiClient.get("/estado");
export const createEstado = (data) => apiClient.post("/estado", data);
// Nota: Seu backend não parece ter update/delete para Estado, mas adicionamos a estrutura.
// export const updateEstado = (id, data) => apiClient.patch(`/estado/${id}`, data);
// export const deleteEstado = (id) => apiClient.delete(`/estado/${id}`);

// --- CIDADE ---
export const getCidades = () => apiClient.get("/cidade");
export const createCidade = (data) => apiClient.post("/cidade", data);
// Nota: Seu backend não parece ter update/delete para Cidade, mas adicionamos a estrutura.
// export const updateCidade = (id, data) => apiClient.patch(`/cidade/${id}`, data);
// export const deleteCidade = (id) => apiClient.delete(`/cidade/${id}`);
