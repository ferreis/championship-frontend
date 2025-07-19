// src/api/provaApi.js
import apiClient from "./axiosConfig";

/**
 * Busca todas as provas.
 */
export const getProvas = () => {
  return apiClient.get("/prova");
};

/**
 * Cria uma nova prova.
 * @param {object} provaData - Os dados da nova prova, conforme ProvaDto.
 */
export const createProva = (provaData) => {
  return apiClient.post("/prova", provaData);
};

/**
 * Atualiza uma prova existente.
 * O ID da prova deve estar em provaData.Id
 * @param {object} provaData - Os dados a serem atualizados, conforme ProvaUpdateDto.
 */
export const updateProva = (provaData) => {
  // O endpoint de atualização no seu backend é um PATCH que espera o ID no corpo
  return apiClient.patch("/prova", provaData);
};

/**
 * Deleta uma prova pelo ID.
 */
export const deleteProva = (id) => {
  return apiClient.delete(`/prova/${id}`);
};
