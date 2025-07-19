// src/api/participacaoProvaApi.js
import apiClient from "./axiosConfig";

/**
 * Busca todas as participações em provas.
 */
export const getParticipacoes = () => {
  return apiClient.get("/participacaoprova");
};

/**
 * Cria um novo registro de participação.
 * @param {object} data - Dados conforme ParticipacaoProvaDto.
 */
export const createParticipacao = (data) => {
  return apiClient.post("/participacaoprova", data);
};

/**
 * Atualiza um registro de participação.
 * @param {object} data - Dados conforme ParticipacaoProvaUpdateDto.
 */
export const updateParticipacao = (data) => {
  return apiClient.patch("/participacaoprova", data);
};

/**
 * Deleta um registro de participação pelo ID.
 */
export const deleteParticipacao = (id) => {
  return apiClient.delete(`/participacaoprova/${id}`);
};
