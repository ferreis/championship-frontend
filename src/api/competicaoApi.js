// src/api/competicaoApi.js
import apiClient from "./axiosConfig";

/**
 * Busca todas as competições.
 */
export const getCompeticoes = () => {
  return apiClient.get("/competicao");
};

/**
 * Busca uma competição específica pelo ID.
 */
export const getCompeticaoById = (id) => {
  return apiClient.get(`/competicao/${id}`);
};

/**
 * Cria uma nova competição.
 * @param {object} competicaoData - Os dados da nova competição.
 */
export const createCompeticao = (competicaoData) => {
  return apiClient.post("/competicao", competicaoData);
};

/**
 * Atualiza uma competição existente.
 * O ID da competição deve estar em competicaoData.Id
 * @param {object} competicaoData - Os dados a serem atualizados.
 */
export const updateCompeticao = (competicaoData) => {
  return apiClient.patch("/competicao", competicaoData);
};

/**
 * Deleta uma competição pelo ID.
 */
export const deleteCompeticao = (id) => {
  return apiClient.delete(`/competicao/${id}`);
};

// --- Funções Auxiliares para preencher os formulários ---
// Você precisará criar os endpoints e serviços para isso no backend.
// Por agora, vamos assumir que eles existem.

export const getPaises = () => apiClient.get("/pais");
export const getEstados = () => apiClient.get("/estado");
export const getCidades = () => apiClient.get("/cidade");
