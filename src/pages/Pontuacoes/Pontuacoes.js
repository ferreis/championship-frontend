// src/pages/Pontuacoes/Pontuacoes.js
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

// Importa todas as APIs necessárias
import { getPontuacoes, deletePontuacao } from "../../api/pontuacaoApi";
import { getParticipacoes } from "../../api/participacaoProvaApi";
import { getAtletasComEquipes } from "../../api/atletaApi";
import { getProvas } from "../../api/provaApi";
import { getCompeticoes } from "../../api/competicaoApi";

import PontuacaoForm from "./PontuacaoForm";

const Container = styled.div`
  /* ... */
`;
const Table = styled.table`
  /* ... */
`;
const Button = styled.button`
  /* ... */
`;

const Pontuacoes = () => {
  // Estados para os dados
  const [pontuacoes, setPontuacoes] = useState([]);
  const [participacoes, setParticipacoes] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [provas, setProvas] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);

  // Estados de controle da UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPontuacao, setSelectedPontuacao] = useState(null);

  // Mapeamentos para traduzir IDs em nomes
  const participacaoMap = useMemo(
    () => participacoes.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}),
    [participacoes]
  );
  const atletaMap = useMemo(
    () => atletas.reduce((acc, a) => ({ ...acc, [a.atletaId]: a.nome }), {}),
    [atletas]
  );
  const provaMap = useMemo(
    () => provas.reduce((acc, p) => ({ ...acc, [p.id]: p.nome }), {}),
    [provas]
  );
  const competicaoMap = useMemo(
    () => competicoes.reduce((acc, c) => ({ ...acc, [c.id]: c.nome }), {}),
    [competicoes]
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        pontuacoesRes,
        participacoesRes,
        atletasRes,
        provasRes,
        competicoesRes,
      ] = await Promise.all([
        getPontuacoes(),
        getParticipacoes(),
        getAtletasComEquipes(),
        getProvas(),
        getCompeticoes(),
      ]);
      setPontuacoes(pontuacoesRes.data);
      setParticipacoes(participacoesRes.data);
      setAtletas(atletasRes.data);
      setProvas(provasRes.data);
      setCompeticoes(competicoesRes.data);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar dados de pontuação.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    setShowForm(false);
    fetchData(); // Recarrega todos os dados
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover esta pontuação?")) {
      try {
        await deletePontuacao(id);
        fetchData();
      } catch (err) {
        alert("Falha ao remover pontuação.");
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <Container>
      <h1>Gerenciamento de Pontuações</h1>
      {showForm ? (
        <PontuacaoForm
          pontuacaoToEdit={selectedPontuacao}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          participacoes={participacoes}
          atletas={atletas}
          provas={provas}
          competicoes={competicoes}
        />
      ) : (
        <>
          <Button
            onClick={() => {
              setSelectedPontuacao(null);
              setShowForm(true);
            }}
          >
            Lançar Nova Pontuação
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Prova</th>
                <th>Competição</th>
                <th>Pontos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pontuacoes.map((pontuacao) => {
                const participacao =
                  participacaoMap[pontuacao.participacaoProvaId];
                return (
                  <tr key={pontuacao.id}>
                    <td>
                      {participacao ? atletaMap[participacao.atletaId] : "N/A"}
                    </td>
                    <td>
                      {participacao ? provaMap[participacao.provaId] : "N/A"}
                    </td>
                    <td>
                      {participacao
                        ? competicaoMap[participacao.competicaoId]
                        : "N/A"}
                    </td>
                    <td>{pontuacao.pontos}</td>
                    <td>
                      <Button
                        onClick={() => {
                          setSelectedPontuacao(pontuacao);
                          setShowForm(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button onClick={() => handleDelete(pontuacao.id)}>
                        Excluir
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default Pontuacoes;
