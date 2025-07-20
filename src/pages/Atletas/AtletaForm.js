// src/pages/Atletas/AtletaForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createAtleta, updateAtleta } from "../../api/atletaApi";
import { getPaises } from "../../api/localizacaoApi";
import { Button } from "../../components/Button";

const FormContainer = styled.form`
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem; /* <-- O espaçamento entre os campos */
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2px;
  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #495057;
  }
  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 5px;
    border: 1px solid #ced4da;
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
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
        setPaises(response.data || []);
      } catch (err) {
        console.error("Falha ao buscar países", err);
        setError("Não foi possível carregar a lista de países.");
      }
    };
    fetchPaises();

    if (atletaToEdit) {
      setFormData({
        nome: atletaToEdit.nome || "",
        cpf: atletaToEdit.cpf || "",
        genero: atletaToEdit.genero || "M",
        dataNascimento: atletaToEdit.dataNascimento
          ? new Date(atletaToEdit.dataNascimento).toISOString().split("T")[0]
          : "",
        paisId: atletaToEdit.paisId || "",
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
    <FormContainer onSubmit={handleSubmit}>
      {error && <p style={{ color: "red", gridColumn: "1 / -1" }}>{error}</p>}
      <FormGrid>
        <FormGroup>
          <label>Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
          />
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
          </select>
        </FormGroup>
        <FormGroup>
          <label>País</label>
          <select
            name="paisId"
            value={formData.paisId}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecione --</option>
            {paises.map((pais) => (
              <option key={pais.id} value={pais.id}>
                {pais.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <ButtonGroup>
          <Button
            type="button"
            onClick={onCancel}
            style={{ backgroundColor: "#6c757d" }}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </ButtonGroup>
      </FormGrid>
    </FormContainer>
  );
};

export default AtletaForm;
