// src/pages/Competicoes/CompeticaoDetalhes.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCompeticaoDetalhes } from "../../api/competicaoApi";
import { Table } from "../../components/Table"; // Importando nossa tabela estilizada

const Container = styled.div`
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Info = styled.p`
  color: #666;
  margin-bottom: 1rem;
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
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
`;

const ProvaCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
`;

const ProvaTitle = styled.h3`
  color: #555;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const NoInscritos = styled.p`
  color: #999;
  font-style: italic;
`;

const CompeticaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competicao, setCompeticao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        if (id) {
          const response = await getCompeticaoDetalhes(id);
          setCompeticao(response.data);
        }
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
        <ActionButton onClick={() => navigate(`/Inscricoes`)}>
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
            <Table>
              <thead>
                <tr>
                  <th>Nome do Atleta</th>
                  <th>Equipe</th>
                </tr>
              </thead>
              <tbody>
                {prova.atletasInscritos.map((atleta) => (
                  <tr key={atleta.atletaId}>
                    <td>{atleta.nomeAtleta}</td>
                    <td>{atleta.equipeNome}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoInscritos>Nenhum atleta inscrito nesta prova ainda.</NoInscritos>
          )}
        </ProvaCard>
      ))}
    </Container>
  );
};

export default CompeticaoDetalhes;
