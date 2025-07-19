// src/pages/Equipes/EquipeForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createEquipe, updateEquipe } from "../../api/equipeApi";

// Reutilize os estilos de formulário que criamos anteriormente
const FormContainer = styled.div`
  /* ... */
`;
const FormGroup = styled.div`
  /* ... */
`;

const EquipeForm = ({ equipeToEdit, onSave, onCancel, paises, estados }) => {
  const initialState = {
    nome: "",
    tipo: "Estadual",
    paisId: "",
    estadoId: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [filteredEstados, setFilteredEstados] = useState([]);

  useEffect(() => {
    if (equipeToEdit) {
      setFormData({
        nome: equipeToEdit.nome || "",
        tipo: equipeToEdit.tipo || "Estadual",
        paisId: equipeToEdit.paisId || "",
        estadoId: equipeToEdit.estadoId || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [equipeToEdit]);

  // Filtra os estados sempre que o país do formulário mudar
  useEffect(() => {
    if (formData.paisId) {
      setFilteredEstados(
        estados.filter((e) => e.paisId === parseInt(formData.paisId, 10))
      );
    } else {
      setFilteredEstados([]);
    }
    // Reseta o estadoId se o país mudar e o estado selecionado não pertencer mais ao novo país
    if (
      filteredEstados.length > 0 &&
      !filteredEstados.find((e) => e.id === formData.estadoId)
    ) {
      setFormData((prev) => ({ ...prev, estadoId: "" }));
    }
  }, [formData.paisId, estados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte IDs para número, e campos vazios para null
    const dataToSend = {
      ...formData,
      paisId: formData.paisId ? parseInt(formData.paisId, 10) : null,
      estadoId: formData.estadoId ? parseInt(formData.estadoId, 10) : null,
    };

    try {
      if (equipeToEdit) {
        await updateEquipe(equipeToEdit.id, dataToSend);
      } else {
        await createEquipe(dataToSend);
      }
      onSave();
    } catch (error) {
      console.error("Falha ao salvar equipe", error.response?.data);
      alert("Não foi possível salvar a equipe.");
    }
  };
  const tiposDeEquipe = [
    "Estadual",
    "Nacional",
    "Internacional",
    "Clube",
    "Força Armada",
  ];

  return (
    <FormContainer>
      <h2>{equipeToEdit ? "Editar Equipe" : "Nova Equipe"}</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Nome da Equipe</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
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
            {tiposDeEquipe.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup>
          <label>País</label>
          <select name="paisId" value={formData.paisId} onChange={handleChange}>
            <option value="">Selecione um País (opcional)</option>
            {paises.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup>
          <label>Estado</label>
          <select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            disabled={!formData.paisId}
          >
            <option value="">Selecione um Estado (opcional)</option>
            {filteredEstados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </FormGroup>

        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </FormContainer>
  );
};

export default EquipeForm;
