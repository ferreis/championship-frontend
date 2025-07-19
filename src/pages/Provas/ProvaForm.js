// src/pages/Provas/ProvaForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createProva, updateProva } from "../../api/provaApi";

// Estilos para o formulário e seus componentes
const FormContainer = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ProvaForm = ({ provaToEdit, onSave, onCancel }) => {
  const initialState = {
    nome: "",
    tipo: "Praia", // Valor padrão
    modalidade: "Individual", // Valor padrão
    tempoOuColocacao: "Tempo", // Valor padrão
    genero: "unissex", // Valor padrão
    categoriaEtaria: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (provaToEdit) {
      setFormData(provaToEdit);
    } else {
      setFormData(initialState);
    }
  }, [provaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (provaToEdit) {
        // Para o update, mandamos apenas os campos que o DTO espera. O ID vai no corpo.
        const dataToSend = { Id: provaToEdit.id, ...formData };
        await updateProva(dataToSend);
      } else {
        await createProva(formData);
      }
      onSave(); // Notifica o componente pai para recarregar a lista e fechar o form
    } catch (error) {
      console.error(
        "Falha ao salvar prova",
        error.response?.data || error.message
      );
      alert(
        `Erro: ${
          error.response?.data?.detalhes || "Não foi possível salvar a prova."
        }`
      );
    }
  };

  return (
    <FormContainer>
      <h2>{provaToEdit ? "Editar Prova" : "Nova Prova"}</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome da Prova"
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="Praia">Praia</option>
            <option value="Piscina">Piscina</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Modalidade</label>
          <select
            name="modalidade"
            value={formData.modalidade}
            onChange={handleChange}
            required
          >
            <option value="Individual">Individual</option>
            <option value="Dupla">Dupla</option>
            <option value="Revezamento">Revezamento</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Avaliação</label>
          <select
            name="tempoOuColocacao"
            value={formData.tempoOuColocacao}
            onChange={handleChange}
            required
          >
            <option value="Tempo">Tempo</option>
            <option value="Colocacao">Colocação</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Gênero</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="unissex">Unissex</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Categoria Etária</label>
          <input
            type="text"
            name="categoriaEtaria"
            value={formData.categoriaEtaria}
            onChange={handleChange}
            placeholder="Ex: Adulto, Junior, A 18 a 24 anos"
            required
          />
        </FormGroup>

        <ButtonGroup>
          <button type="submit">Salvar</button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default ProvaForm;
