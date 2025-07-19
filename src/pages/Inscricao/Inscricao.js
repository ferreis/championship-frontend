// src/pages/Inscricao/Inscricao.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAtletasComEquipes } from "../../api/atletaApi";
import { getProvas } from "../../api/provaApi";
import {
  createParticipacao,
  deleteParticipacao,
} from "../../api/participacaoProvaApi";
// Importe a função que busca as inscrições atuais
import { getCompeticaoDetalhes } from "../../api/competicaoApi";
import styled from "styled-components";

const Container = styled.div``;
const CheckboxLabel = styled.label`
  display: block;
  margin: 0.5rem 0;
`;

const Inscricao = () => {
  const { competicaoId } = useParams();
  const [atletas, setAtletas] = useState([]);
  const [provas, setProvas] = useState([]);
  const [inscricoes, setInscricoes] = useState({}); // { atletaId: [provaId1, provaId2] }
  const [selectedAtletaId, setSelectedAtletaId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [atletasRes, provasRes, detalhesRes] = await Promise.all([
        getAtletasComEquipes(),
        getProvas(),
        getCompeticaoDetalhes(competicaoId),
      ]);
      setAtletas(atletasRes.data);
      setProvas(provasRes.data);

      // Mapeia as inscrições existentes
      const initialInscricoes = {};
      detalhesRes.data.provas.forEach((prova) => {
        prova.atletasInscritos.forEach((atleta) => {
          if (!initialInscricoes[atleta.atletaId]) {
            initialInscricoes[atleta.atletaId] = [];
          }
          // Armazena um objeto para ter o ID da participação para exclusão
          initialInscricoes[atleta.atletaId].push({
            provaId: prova.provaId,
            participacaoId: atleta.participacaoId,
          });
        });
      });
      setInscricoes(initialInscricoes);
    };
    loadData();
  }, [competicaoId]);

  const handleCheckboxChange = async (atletaId, provaId) => {
    const isCurrentlyInscrito = inscricoes[atletaId]?.some(
      (p) => p.provaId === provaId
    );

    if (isCurrentlyInscrito) {
      // Lógica para DESINSCREVER
      const participacao = inscricoes[atletaId].find(
        (p) => p.provaId === provaId
      );
      await deleteParticipacao(participacao.participacaoId);
    } else {
      // Lógica para INSCREVER
      const atleta = atletas.find((a) => a.atletaId === atletaId);
      await createParticipacao({
        atletaId,
        provaId,
        competicaoId: parseInt(competicaoId),
        equipeId: atleta.equipeId || null, // Adiciona o ID da equipe se existir
      });
    }

    // Recarrega as inscrições para atualizar o estado
    const response = await getCompeticaoDetalhes(competicaoId);
    const newInscricoes = {};
    response.data.provas.forEach((prova) => {
      prova.atletasInscritos.forEach((atleta) => {
        if (!newInscricoes[atleta.atletaId])
          newInscricoes[atleta.atletaId] = [];
        newInscricoes[atleta.atletaId].push({
          provaId: prova.provaId,
          participacaoId: atleta.participacaoId,
        });
      });
    });
    setInscricoes(newInscricoes);
  };

  return (
    <Container>
      <h1>Inscrição de Atletas</h1>
      <div>
        <label>Selecione um Atleta: </label>
        <select
          value={selectedAtletaId}
          onChange={(e) => setSelectedAtletaId(parseInt(e.target.value))}
        >
          <option value="">-- Escolha um atleta --</option>
          {atletas.map((atleta) => (
            <option key={atleta.atletaId} value={atleta.atletaId}>
              {atleta.nome}
            </option>
          ))}
        </select>
      </div>

      {selectedAtletaId && (
        <div>
          <h2>Provas Disponíveis</h2>
          {provas.map((prova) => (
            <CheckboxLabel key={prova.id}>
              <input
                type="checkbox"
                checked={
                  inscricoes[selectedAtletaId]?.some(
                    (p) => p.provaId === prova.id
                  ) || false
                }
                onChange={() =>
                  handleCheckboxChange(selectedAtletaId, prova.id)
                }
              />
              {prova.nome}
            </CheckboxLabel>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Inscricao;
