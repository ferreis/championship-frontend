// src/pages/Provas/ProvaForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createProva, updateProva } from "../../api/provaApi";
import { Button } from "../../components/Button";

// --- Estilos ---
const FormContainer = styled.form`
  background-color: white;
  padding: 2rem 2.5rem; /* Adicionei mais padding lateral */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem; /* Espaço entre os elementos */
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.3rem; /* Pequeno respiro lateral */
  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #34495e;
  }
  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 5px;
    border: 1px solid #ced4da;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    margin-bottom: 0.5rem; /* Espaço entre campos */
    &:focus {
      border-color: #3498db;
      outline: none;
    }
  }
`;

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0.5rem;
`;

const ProvaForm = ({ provaToEdit, onSave, onCancel }) => {
  const initialState = {
    nome: "",
    tipo: "Praia",
    modalidade: "Individual",
    tempoOuColocacao: "Tempo",
    genero: "unissex",
    categoriaEtaria: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(provaToEdit || initialState);
  }, [provaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (provaToEdit) {
        await updateProva({ Id: provaToEdit.id, ...formData });
      } else {
        await createProva(formData);
      }
      onSave();
    } catch (error) {
      console.error("Falha ao salvar prova", error.response?.data);
      alert(
        `Erro: ${
          error.response?.data?.detalhes || "Não foi possível salvar a prova."
        }`
      );
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGrid>
        <FormGroup>
          <label>Nome da Prova</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: 100m Nado Livre"
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Categoria Etária</label>
          <input
            type="text"
            name="categoriaEtaria"
            value={formData.categoriaEtaria}
            onChange={handleChange}
            placeholder="Ex: Adulto, Junior, Open"
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

        <ButtonGroup>
          <Button
            type="button"
            onClick={onCancel}
            style={{ backgroundColor: "#7f8c8d" }}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </ButtonGroup>
      </FormGrid>
    </FormContainer>
  );
};

export default ProvaForm;
