// src/pages/Pontuacoes/PontuacaoForm.js
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { createPontuacao, updatePontuacao } from "../../api/pontuacaoApi";

const FormContainer = styled.div`
  /* ... estilos do formulário ... */
`;
const FormGroup = styled.div`
  /* ... estilos ... */
`;

const PontuacaoForm = ({
  pontuacaoToEdit,
  onSave,
  onCancel,
  participacoes,
  atletas,
  provas,
  competicoes,
}) => {
  const initialState = {
    participacaoProvaId: "",
    pontos: 0,
  };

  const [formData, setFormData] = useState(initialState);

  // Mapeia IDs para nomes para exibir no dropdown de forma amigável
  const participacaoDetails = useMemo(() => {
    const atletaMap = atletas.reduce(
      (acc, a) => ({ ...acc, [a.atletaId]: a.nome }),
      {}
    );
    const provaMap = provas.reduce(
      (acc, p) => ({ ...acc, [p.id]: p.nome }),
      {}
    );
    const competicaoMap = competicoes.reduce(
      (acc, c) => ({ ...acc, [c.id]: c.nome }),
      {}
    );

    return participacoes.map((p) => ({
      id: p.id,
      displayText: `${atletaMap[p.atletaId] || "Atleta Desc."} - ${
        provaMap[p.provaId] || "Prova Desc."
      } (${competicaoMap[p.competicaoId] || "Comp. Desc."})`,
    }));
  }, [participacoes, atletas, provas, competicoes]);

  useEffect(() => {
    if (pontuacaoToEdit) {
      setFormData({
        participacaoProvaId: pontuacaoToEdit.participacaoProvaId || "",
        pontos: pontuacaoToEdit.pontos || 0,
      });
    } else {
      setFormData(initialState);
    }
  }, [pontuacaoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      participacaoProvaId: parseInt(formData.participacaoProvaId, 10),
      pontos: parseInt(formData.pontos, 10),
    };

    try {
      if (pontuacaoToEdit) {
        await updatePontuacao({ Id: pontuacaoToEdit.id, ...dataToSend });
      } else {
        await createPontuacao(dataToSend);
      }
      onSave();
    } catch (error) {
      console.error("Falha ao salvar pontuação", error.response?.data);
      alert("Não foi possível salvar a pontuação.");
    }
  };

  return (
    <FormContainer>
      <h2>{pontuacaoToEdit ? "Editar Pontuação" : "Lançar Nova Pontuação"}</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Participação (Atleta - Prova - Competição)</label>
          <select
            name="participacaoProvaId"
            value={formData.participacaoProvaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma participação</option>
            {participacaoDetails.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayText}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup>
          <label>Pontos</label>
          <input
            type="number"
            name="pontos"
            value={formData.pontos}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <button type="submit">Salvar Pontuação</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </FormContainer>
  );
};

export default PontuacaoForm;
