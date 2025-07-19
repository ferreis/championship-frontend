// src/api/equipeApi.js
import apiClient from "./axiosConfig";

/**
 * Busca todas as equipes.
 */
export const getEquipes = () => {
  return apiClient.get("/equipe");
};

/**
 * Cria uma nova equipe.
 * @param {object} equipeData - Os dados da nova equipe.
 */
export const createEquipe = (equipeData) => {
  return apiClient.post("/equipe", equipeData);
};

/**
 * Atualiza uma equipe existente.
 * @param {number} id - O ID da equipe a ser atualizada.
 * @param {object} equipeData - Os dados a serem atualizados (EquipeUpdateDto).
 */
export const updateEquipe = (id, equipeData) => {
  return apiClient.patch(`/equipe/${id}`, equipeData);
};

/**
 * Deleta uma equipe pelo ID.
 */
export const deleteEquipe = (id) => {
  return apiClient.delete(`/equipe/${id}`);
};
