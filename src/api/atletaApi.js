// src/api/atletaApi.js
import apiClient from "./axiosConfig";

/**
 * Busca a lista de atletas já com os dados da equipe e nacionalidade.
 */
export const getAtletasComEquipes = () => {
  // O seu controller está configurado para retornar a lista completa neste endpoint
  return apiClient.get("/atleta/com-equipes");
};

/**
 * Cria um novo atleta.
 * @param {object} atletaData - Os dados do novo atleta.
 */
export const createAtleta = (atletaData) => {
  return apiClient.post("/atleta", atletaData);
};

/**
 * Atualiza os dados de um atleta.
 * @param {object} atletaData - Os dados a serem atualizados. O DTO espera o ID no corpo.
 */
export const updateAtleta = (atletaData) => {
  return apiClient.patch("/atleta", atletaData);
};

/**
 * Deleta um atleta pelo seu ID.
 */
export const deleteAtleta = (id) => {
  return apiClient.delete(`/atleta/${id}`);
};

/**
 * Busca a lista de todos os países para preencher o formulário.
 */
export const getPaises = () => {
  return apiClient.get("/pais");
};
