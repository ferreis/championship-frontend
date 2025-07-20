// src/api/provaApi.js
import apiClient from "./axiosConfig";

/**
 * Busca as provas de forma paginada.
 */
export const getProvas = (pageNumber = 1, pageSize = 10) => {
  return apiClient.get(`/prova?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

/**
 * Cria uma nova prova.
 */
export const createProva = (provaData) => {
  return apiClient.post("/prova", provaData);
};

/**
 * Atualiza uma prova existente.
 */
export const updateProva = (provaData) => {
  return apiClient.patch("/prova", provaData);
};

/**
 * Deleta uma prova pelo ID.
 */
export const deleteProva = (id) => {
  return apiClient.delete(`/prova/${id}`);
};
