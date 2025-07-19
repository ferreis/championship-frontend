// src/api/atletaApi.js
import apiClient from "./axiosConfig";

/**
 * Busca a lista de atletas de forma paginada e com filtros.
 * @param {object} filters - { competicaoId, equipeId, atletaId, pageNumber, pageSize }
 */
export const getAtletasComEquipes = (filters = {}) => {
  // CORREÇÃO: Garante que apenas filtros com valor sejam enviados para a API
  const cleanFilters = {};
  for (const key in filters) {
    if (filters[key] != null && filters[key] !== "") {
      cleanFilters[key] = filters[key];
    }
  }

  const params = new URLSearchParams(cleanFilters);
  return apiClient.get(`/atleta?${params.toString()}`);
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
 * Vincula um atleta a uma equipe para uma competição específica.
 * @param {object} vinculoData - { atletaId, equipeId, competicaoId }
 */
export const vincularAtletaEquipe = (vinculoData) => {
  return apiClient.post("/atleta/vincular", vinculoData);
};
