// src/pages/Atletas/AtletaForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createAtleta, updateAtleta } from "../../api/atletaApi";
import { getPaises } from "../../api/localizacaoApi.js"; // Usaremos uma API específica de País

const FormContainer = styled.div`
  /* ... (mesmos estilos de formulário das outras telas) ... */
`;

const AtletaForm = ({ atletaToEdit, onSave, onCancel }) => {
  const initialState = {
    nome: "",
    cpf: "",
    genero: "M",
    dataNascimento: "",
    paisId: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [paises, setPaises] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await getPaises();
        setPaises(response.data);
      } catch (err) {
        console.error("Falha ao buscar países", err);
        setError("Não foi possível carregar a lista de países.");
      }
    };
    fetchPaises();

    if (atletaToEdit) {
      // O objeto do atleta da lista é AtletaComEquipeDto, ajustamos para o formulário
      setFormData({
        nome: atletaToEdit.nome,
        cpf: atletaToEdit.cpf,
        genero: atletaToEdit.genero,
        dataNascimento: new Date(atletaToEdit.dataNascimento)
          .toISOString()
          .split("T")[0],
        paisId: atletaToEdit.paisId,
      });
    } else {
      setFormData(initialState);
    }
  }, [atletaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const dataToSend = {
      ...formData,
      paisId: parseInt(formData.paisId, 10),
    };

    try {
      if (atletaToEdit) {
        // O DTO de update espera o ID no corpo da requisição
        await updateAtleta({ Id: atletaToEdit.atletaId, ...dataToSend });
      } else {
        await createAtleta(dataToSend);
      }
      onSave();
    } catch (err) {
      console.error("Falha ao salvar atleta", err.response?.data);
      setError(err.response?.data?.erro || "Ocorreu um erro ao salvar.");
    }
  };

  return (
    <FormContainer>
      <h2>{atletaToEdit ? "Editar Atleta" : "Novo Atleta"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome completo"
          required
        />
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="CPF (somente números)"
          required
        />
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          required
        />

        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          required
        >
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>

        <select
          name="paisId"
          value={formData.paisId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um País</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.nome}
            </option>
          ))}
        </select>

        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </FormContainer>
  );
};

export default AtletaForm;
