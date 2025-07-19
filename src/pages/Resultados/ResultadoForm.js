// src/pages/Resultados/ResultadoForm.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createParticipacao,
  updateParticipacao,
} from "../../api/participacaoProvaApi";

const FormContainer = styled.div`
  /* ... estilos do formulário ... */
`;
const FormGroup = styled.div`
  /* ... estilos ... */
`;

const ResultadoForm = ({
  participacaoToEdit,
  onSave,
  onCancel,
  atletas,
  equipes,
  provas,
  competicoes,
}) => {
  const initialState = {
    atletaId: "",
    equipeId: "",
    provaId: "",
    competicaoId: "",
    tempo: "",
    colocacao: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedProva, setSelectedProva] = useState(null);

  useEffect(() => {
    if (participacaoToEdit) {
      setFormData({
        atletaId: participacaoToEdit.atletaId || "",
        equipeId: participacaoToEdit.equipeId || "",
        provaId: participacaoToEdit.provaId || "",
        competicaoId: participacaoToEdit.competicaoId || "",
        tempo: participacaoToEdit.tempo || "",
        colocacao: participacaoToEdit.colocacao || "",
      });
      // Sincroniza a prova selecionada ao editar
      const prova = provas.find((p) => p.id === participacaoToEdit.provaId);
      setSelectedProva(prova);
    } else {
      setFormData(initialState);
      setSelectedProva(null);
    }
  }, [participacaoToEdit, provas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "provaId") {
      const prova = provas.find((p) => p.id === parseInt(value, 10));
      setSelectedProva(prova);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      atletaId: parseInt(formData.atletaId, 10),
      equipeId: formData.equipeId ? parseInt(formData.equipeId, 10) : null,
      provaId: parseInt(formData.provaId, 10),
      competicaoId: parseInt(formData.competicaoId, 10),
      tempo: formData.tempo ? parseFloat(formData.tempo) : null,
      colocacao: formData.colocacao ? parseInt(formData.colocacao, 10) : null,
    };

    try {
      if (participacaoToEdit) {
        await updateParticipacao({ Id: participacaoToEdit.id, ...dataToSend });
      } else {
        await createParticipacao(dataToSend);
      }
      onSave();
    } catch (error) {
      console.error("Falha ao salvar resultado", error.response?.data);
      alert("Não foi possível salvar o resultado.");
    }
  };

  return (
    <FormContainer>
      <h2>
        {participacaoToEdit ? "Editar Resultado" : "Lançar Novo Resultado"}
      </h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Competição</label>
          <select
            name="competicaoId"
            value={formData.competicaoId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a Competição</option>
            {competicoes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Atleta</label>
          <select
            name="atletaId"
            value={formData.atletaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o Atleta</option>
            {/* A lista de atletas do seu backend é AtletaComEquipeDto, então o id é atletaId */}
            {atletas.map((a) => (
              <option key={a.atletaId} value={a.atletaId}>
                {a.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Prova</label>
          <select
            name="provaId"
            value={formData.provaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a Prova</option>
            {provas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Equipe (Opcional)</label>
          <select
            name="equipeId"
            value={formData.equipeId}
            onChange={handleChange}
          >
            <option value="">Selecione a Equipe</option>
            {equipes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </FormGroup>

        {/* Renderização condicional baseada na prova selecionada */}
        {selectedProva?.tempoOuColocacao === "Tempo" && (
          <FormGroup>
            <label>Tempo</label>
            <input
              type="number"
              step="0.01"
              name="tempo"
              value={formData.tempo}
              onChange={handleChange}
              placeholder="0.00"
            />
          </FormGroup>
        )}
        {selectedProva?.tempoOuColocacao === "Colocacao" && (
          <FormGroup>
            <label>Colocação</label>
            <input
              type="number"
              name="colocacao"
              value={formData.colocacao}
              onChange={handleChange}
              placeholder="1, 2, 3..."
            />
          </FormGroup>
        )}

        <button type="submit">Salvar Resultado</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </FormContainer>
  );
};

export default ResultadoForm;
