// src/pages/Competicoes/CompeticaoDetalhes.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
// Supondo que você crie um arquivo para a API de competições
import { getCompeticaoDetalhes } from "../../api/competicaoApi";

const Container = styled.div`
  padding: 2rem;
`;

const ProvaCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const AtletaList = styled.ul`
  list-style-type: none;
  padding-left: 1rem;
`;

const CompeticaoDetalhes = () => {
  const { id } = useParams(); // Pega o ID da competição da URL
  const navigate = useNavigate();
  const [competicao, setCompeticao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        const response = await getCompeticaoDetalhes(id);
        setCompeticao(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da competição", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalhes();
  }, [id]);

  if (loading) return <p>Carregando detalhes da competição...</p>;
  if (!competicao) return <p>Competição não encontrada.</p>;

  return (
    <Container>
      <h1>{competicao.nome}</h1>
      <p>
        <strong>Período:</strong>{" "}
        {new Date(competicao.dataInicio).toLocaleDateString()} a{" "}
        {new Date(competicao.dataFim).toLocaleDateString()}
      </p>

      <button onClick={() => navigate(`/inscricao/${id}`)}>
        Inscrever / Gerenciar Atletas
      </button>

      <h2>Provas e Atletas Inscritos</h2>
      {competicao.provas.map((prova) => (
        <ProvaCard key={prova.provaId}>
          <h3>
            {prova.nomeProva} ({prova.modalidade})
          </h3>
          {prova.atletasInscritos.length > 0 ? (
            <AtletaList>
              {prova.atletasInscritos.map((atleta) => (
                <li key={atleta.atletaId}>{atleta.nomeAtleta}</li>
              ))}
            </AtletaList>
          ) : (
            <p>Nenhum atleta inscrito nesta prova ainda.</p>
          )}
        </ProvaCard>
      ))}
    </Container>
  );
};

export default CompeticaoDetalhes;
