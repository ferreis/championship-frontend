// src/pages/Inscricoes/Inscricoes.js (ou GerenciarInscricoes.js)
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { getCompeticoes, getCompeticaoDetalhes } from "../../api/competicaoApi";
import { getEquipes } from "../../api/equipeApi";
import { getAtletasComEquipes } from "../../api/atletaApi";
import {
  createParticipacao,
  deleteParticipacao,
} from "../../api/participacaoProvaApi";

// ... (Seus styled-components continuam os mesmos)
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;
const Title = styled.h1`
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 2rem;
`;
const SelectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;
const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #495057;
  }
  select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 5px;
    border: 1px solid #ced4da;
    font-size: 1rem;
    background-color: white;
  }
`;
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
`;
const Box = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;
const BoxTitle = styled.h2`
  font-size: 1.5rem;
  color: #34495e;
  margin-top: 0;
  margin-bottom: 1rem;
`;
const AtletaCheckbox = styled.div`
  label {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: #e9ecef;
    }
  }
  input {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
  }
`;

const Inscricoes = () => {
  const { competicaoId: competicaoIdFromUrl } = useParams();

  const [competicoes, setCompeticoes] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [atletas, setAtletas] = useState([]);

  const [selectedCompId, setSelectedCompId] = useState(
    competicaoIdFromUrl || ""
  );
  const [selectedProvaId, setSelectedProvaId] = useState("");
  const [selectedEquipeId, setSelectedEquipeId] = useState("");
  const [loading, setLoading] = useState(true);

  const [provasDaCompeticao, setProvasDaCompeticao] = useState([]);
  const [atletasDaEquipe, setAtletasDaEquipe] = useState([]);
  const [inscricoesNaProva, setInscricoesNaProva] = useState([]);

  const fetchDetalhes = useCallback(async (competicaoId) => {
    try {
      const detalhesRes = await getCompeticaoDetalhes(competicaoId);
      setProvasDaCompeticao(detalhesRes.data.provas);
      return detalhesRes.data.provas;
    } catch (error) {
      console.error("Erro ao buscar detalhes da competição", error);
      return [];
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [competicoesRes, equipesRes, atletasRes] = await Promise.all([
          getCompeticoes(),
          getEquipes(),
          getAtletasComEquipes(),
        ]);
        setCompeticoes(competicoesRes.data);
        setEquipes(equipesRes.data);
        setAtletas(atletasRes.data);
        if (competicaoIdFromUrl) {
          await fetchDetalhes(competicaoIdFromUrl);
        }
      } catch (error) {
        console.error("Falha ao carregar dados iniciais", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [competicaoIdFromUrl, fetchDetalhes]);

  useEffect(() => {
    if (!selectedCompId) {
      setProvasDaCompeticao([]);
      setSelectedProvaId("");
      return;
    }
    fetchDetalhes(selectedCompId);
    setSelectedProvaId("");
  }, [selectedCompId, fetchDetalhes]);

  useEffect(() => {
    if (selectedProvaId) {
      const provaAtual = provasDaCompeticao.find(
        (p) => p.provaId === parseInt(selectedProvaId)
      );
      setInscricoesNaProva(provaAtual ? provaAtual.atletasInscritos : []);
    } else {
      setInscricoesNaProva([]);
    }
  }, [selectedProvaId, provasDaCompeticao]);

  useEffect(() => {
    if (selectedEquipeId === "individual") {
      setAtletasDaEquipe(atletas.filter((a) => !a.equipeNome));
    } else if (selectedEquipeId) {
      const equipe = equipes.find((e) => e.id === parseInt(selectedEquipeId));
      setAtletasDaEquipe(atletas.filter((a) => a.equipeNome === equipe?.nome));
    } else {
      setAtletasDaEquipe([]);
    }
  }, [selectedEquipeId, atletas, equipes]);

  const handleCheckboxChange = async (atleta, isChecked) => {
    if (!selectedProvaId) {
      alert("Por favor, selecione uma prova primeiro.");
      return;
    }

    const participacao = inscricoesNaProva.find(
      (i) => i.atletaId === atleta.atletaId
    );

    try {
      if (isChecked && !participacao) {
        await createParticipacao({
          atletaId: atleta.atletaId,
          provaId: parseInt(selectedProvaId),
          competicaoId: parseInt(selectedCompId),
          equipeId: atleta.equipeId || null,
        });
      } else if (!isChecked && participacao) {
        // ### CORREÇÃO AQUI ###
        // Adicionamos uma verificação para garantir que o ID da participação existe
        if (participacao.participacaoId) {
          await deleteParticipacao(participacao.participacaoId);
        } else {
          console.error(
            "Erro: Tentativa de deletar uma participação sem ID!",
            participacao
          );
          alert(
            "Ocorreu um erro ao tentar remover a inscrição. Verifique o console para mais detalhes."
          );
        }
      }
      const provasAtualizadas = await fetchDetalhes(selectedCompId);
      const provaAtual = provasAtualizadas.find(
        (p) => p.provaId === parseInt(selectedProvaId)
      );
      setInscricoesNaProva(provaAtual ? provaAtual.atletasInscritos : []);
    } catch (error) {
      console.error("Erro ao gerenciar inscrição", error);
      alert("Ocorreu um erro ao processar a inscrição.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <Container>
      <Title>Gerenciamento de Inscrições</Title>
      <SelectGrid>
        <FormGroup>
          <label>1. Selecione a Competição</label>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
          >
            <option value="">-- Torneios --</option>
            {competicoes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>2. Selecione a Prova</label>
          <select
            value={selectedProvaId}
            onChange={(e) => setSelectedProvaId(e.target.value)}
            disabled={!selectedCompId}
          >
            <option value="">-- Provas --</option>
            {provasDaCompeticao.map((p) => (
              <option key={p.provaId} value={p.provaId}>
                {p.nomeProva}
              </option>
            ))}
          </select>
        </FormGroup>
      </SelectGrid>

      {selectedProvaId && (
        <MainContent>
          <Box>
            <BoxTitle>3. Adicionar Atletas</BoxTitle>
            <FormGroup>
              <label>Filtrar por Equipe</label>
              <select
                value={selectedEquipeId}
                onChange={(e) => setSelectedEquipeId(e.target.value)}
              >
                <option value="">-- Selecione para ver atletas --</option>
                {equipes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
                <option value="individual">Individual (Sem Equipe)</option>
              </select>
            </FormGroup>

            {atletasDaEquipe.map((atleta) => {
              const isChecked = inscricoesNaProva.some(
                (i) => i.atletaId === atleta.atletaId
              );
              return (
                <AtletaCheckbox key={atleta.atletaId}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(atleta, e.target.checked)
                      }
                    />
                    {atleta.nome}
                  </label>
                </AtletaCheckbox>
              );
            })}
          </Box>
          <Box>
            <BoxTitle>Atletas Inscritos</BoxTitle>
            <ul>
              {inscricoesNaProva.map((insc) => (
                <li key={insc.participacaoId}>{insc.nomeAtleta}</li>
              ))}
            </ul>
          </Box>
        </MainContent>
      )}
    </Container>
  );
};

export default Inscricoes;
