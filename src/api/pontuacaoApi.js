// src/api/pontuacaoApi.js
import apiClient from "./axiosConfig";

/**
 * Busca todos os registros de pontuação.
 */
export const getPontuacoes = () => {
  return apiClient.get("/pontuacao");
};

/**
 * Cria um novo registro de pontuação.
 * @param {object} data - Dados conforme PontuacaoDto.
 */
export const createPontuacao = (data) => {
  return apiClient.post("/pontuacao", data);
};

/**
 * Atualiza um registro de pontuação.
 * @param {object} data - Dados conforme PontuacaoUpdateDto.
 */
export const updatePontuacao = (data) => {
  return apiClient.patch("/pontuacao", data);
};

/**
 * Deleta um registro de pontuação pelo ID.
 */
export const deletePontuacao = (id) => {
  return apiClient.delete(`/pontuacao/${id}`);
};
