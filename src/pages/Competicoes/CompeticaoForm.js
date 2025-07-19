// src/pages/Competicoes/CompeticaoForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createCompeticao,
  updateCompeticao,
  getPaises,
  getEstados,
  getCidades,
} from "../../api/competicaoApi";

// Estilos para o formulário
const FormContainer = styled.div`
  /* ... estilos do formulário ... */
`;

const CompeticaoForm = ({ competicaoToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: "",
    dataInicio: "",
    dataFim: "",
    ano: new Date().getFullYear(),
    paisId: "",
    estadoId: "",
    cidadeId: "",
    // O campo 'local' foi removido para usar a estrutura de Pais/Estado/Cidade
  });

  // Estados para preencher os dropdowns
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    // Se estiver editando, preenche o formulário com os dados da competição
    if (competicaoToEdit) {
      setFormData({
        ...competicaoToEdit,
        dataInicio: new Date(competicaoToEdit.dataInicio)
          .toISOString()
          .split("T")[0],
        dataFim: new Date(competicaoToEdit.dataFim).toISOString().split("T")[0],
      });
    }

    // Carrega os dados para os dropdowns
    const loadDropdownData = async () => {
      try {
        const paisesRes = await getPaises();
        setPaises(paisesRes.data);

        const estadosRes = await getEstados();
        setEstados(estadosRes.data);

        const cidadesRes = await getCidades();
        setCidades(cidadesRes.data);
      } catch (error) {
        console.error("Falha ao carregar dados de localização", error);
      }
    };

    loadDropdownData();
  }, [competicaoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      ano: parseInt(formData.ano, 10),
      paisId: parseInt(formData.paisId, 10),
      estadoId: parseInt(formData.estadoId, 10),
      cidadeId: parseInt(formData.cidadeId, 10),
    };

    try {
      if (competicaoToEdit) {
        await updateCompeticao({ Id: competicaoToEdit.id, ...dataToSend });
      } else {
        await createCompeticao(dataToSend);
      }
      onSave(); // Notifica o componente pai para recarregar a lista
    } catch (error) {
      console.error(
        "Falha ao salvar competição",
        error.response?.data || error.message
      );
      alert(
        `Erro: ${
          error.response?.data?.detalhes ||
          "Não foi possível salvar a competição."
        }`
      );
    }
  };

  return (
    <FormContainer>
      <h2>{competicaoToEdit ? "Editar Competição" : "Nova Competição"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome da Competição"
          required
        />
        <input
          type="date"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dataFim"
          value={formData.dataFim}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="ano"
          value={formData.ano}
          onChange={handleChange}
          placeholder="Ano"
          required
        />

        <select
          name="paisId"
          value={formData.paisId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o País</option>
          {paises.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <select
          name="estadoId"
          value={formData.estadoId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o Estado</option>
          {estados
            .filter((e) => e.paisId === parseInt(formData.paisId, 10))
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
        </select>

        <select
          name="cidadeId"
          value={formData.cidadeId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione a Cidade</option>
          {cidades
            .filter((c) => c.estadoId === parseInt(formData.estadoId, 10))
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
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

export default CompeticaoForm;
