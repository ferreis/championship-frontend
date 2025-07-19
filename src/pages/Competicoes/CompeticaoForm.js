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

// Container principal do formulário
const FormContainer = styled.div`
  background: white;
  padding: 25px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #2c3e50;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

// Estilo para inputs e selects
const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

// Estilo para botões
const Button = styled.button`
  background-color: ${(props) => (props.cancel ? "#7f8c8d" : "#3498db")};
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.cancel ? "#636e72" : "#2980b9")};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
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
  });

  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    if (competicaoToEdit) {
      setFormData({
        ...competicaoToEdit,
        dataInicio: new Date(competicaoToEdit.dataInicio)
          .toISOString()
          .split("T")[0],
        dataFim: new Date(competicaoToEdit.dataFim).toISOString().split("T")[0],
      });
    }

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
      onSave();
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
        <Input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome da Competição"
          required
        />
        <Input
          type="date"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          required
        />
        <Input
          type="date"
          name="dataFim"
          value={formData.dataFim}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          name="ano"
          value={formData.ano}
          onChange={handleChange}
          placeholder="Ano"
          required
        />

        <Select
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
        </Select>

        <Select
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
        </Select>

        <Select
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
        </Select>

        <ButtonGroup>
          <Button type="submit">Salvar</Button>
          <Button type="button" cancel onClick={onCancel}>
            Cancelar
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default CompeticaoForm;
