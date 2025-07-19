// src/pages/Competicoes/CompeticaoDetalhes.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCompeticaoDetalhes } from "../../api/competicaoApi";

const Container = styled.div`
  padding: 30px;
  max-width: 960px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
`;

const Header = styled.div`
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 5px;
`;

const Info = styled.p`
  color: #666;
  margin-bottom: 8px;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-top: 25px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const ProvaCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
`;

const ProvaTitle = styled.h3`
  color: #555;
  margin-top: 0;
  margin-bottom: 10px;
`;

const AtletaList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
`;

const AtletaItem = styled.li`
  color: #777;
  margin-bottom: 5px;
`;

const NoInscritos = styled.p`
  color: #999;
`;

const CompeticaoDetalhes = () => {
  const { id } = useParams();
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
      <Header>
        <Title>{competicao.nome}</Title>
        <Info>
          <strong>Período:</strong>{" "}
          {new Date(competicao.dataInicio).toLocaleDateString()} a{" "}
          {new Date(competicao.dataFim).toLocaleDateString()}
        </Info>
        <ActionButton onClick={() => navigate(`/inscricoes`)}>
          Inscrever / Gerenciar Atletas
        </ActionButton>
      </Header>

      <SectionTitle>Provas e Atletas Inscritos</SectionTitle>
      {competicao.provas.map((prova) => (
        <ProvaCard key={prova.provaId}>
          <ProvaTitle>
            {prova.nomeProva} ({prova.modalidade})
          </ProvaTitle>
          {prova.atletasInscritos.length > 0 ? (
            <AtletaList>
              {prova.atletasInscritos.map((atleta) => (
                <AtletaItem key={atleta.atletaId}>
                  {atleta.nomeAtleta}
                </AtletaItem>
              ))}
            </AtletaList>
          ) : (
            <NoInscritos>Nenhum atleta inscrito nesta prova ainda.</NoInscritos>
          )}
        </ProvaCard>
      ))}
    </Container>
  );
};

export default CompeticaoDetalhes;
