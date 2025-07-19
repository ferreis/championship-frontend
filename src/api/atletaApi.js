// src/api/atletaApi.js
import apiClient from "./axiosConfig";

/**
 * Busca a lista de atletas, opcionalmente filtrando por ID da competição.
 * @param {number} [competicaoId] - O ID da competição para filtrar os vínculos.
 */
export const getAtletasComEquipes = (competicaoId) => {
  const url = competicaoId ? `/atleta?competicaoId=${competicaoId}` : "/atleta";
  return apiClient.get(url);
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

/**
 * Vincula um atleta a uma equipe para uma competição específica.
 * @param {object} vinculoData - { atletaId, equipeId, competicaoId }
 */
export const vincularAtletaEquipe = (vinculoData) => {
  return apiClient.post("/atleta/vincular", vinculoData);
};
