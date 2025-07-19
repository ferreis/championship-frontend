// src/pages/Vinculo/VinculoAtletaEquipe.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAtletasComEquipes,
  vincularAtletaEquipe,
} from "../../api/atletaApi";
import { getEquipes } from "../../api/equipeApi";
import { getCompeticoes } from "../../api/competicaoApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";

// Estilos (Podem ser movidos para um arquivo separado se preferir)
const Container = styled.div`
  max-width: 960px;
  margin: auto;
`;
const Header = styled.div`
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
`;
const FormContainer = styled.form`
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
`;
const FormGroup = styled.div`
  flex: 1;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #495057;
  }
  select,
  input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 5px;
    border: 1px solid #ced4da;
    font-size: 1rem;
  }
`;
const Message = styled.p`
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  color: white;
  font-weight: bold;
  background-color: ${(props) =>
    props.type === "success" ? "#28a745" : "#dc3545"};
`;

const VinculoAtletaEquipe = () => {
  // Estados para os dados
  const [atletas, setAtletas] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);

  // Estados do Formulário
  const [selectedCompId, setSelectedCompId] = useState("");
  const [atletaId, setAtletaId] = useState("");
  const [equipeId, setEquipeId] = useState("");

  // Estados de UI
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [atletasFiltrados, setAtletasFiltrados] = useState([]);

  // Busca todos os dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, equipesRes, atletasRes] = await Promise.all([
          getCompeticoes(),
          getEquipes(),
          getAtletasComEquipes(),
        ]);
        setCompeticoes(compRes.data);
        setEquipes(equipesRes.data);
        setAtletas(atletasRes.data);
      } catch (err) {
        setError("Falha ao carregar dados iniciais.");
      }
    };
    fetchData();
  }, []);

  // Filtra a tabela de vínculos sempre que uma competição é selecionada
  useEffect(() => {
    if (selectedCompId) {
      const competicaoAtual = competicoes.find(
        (c) => c.id === parseInt(selectedCompId)
      );
      if (competicaoAtual) {
        // Filtra os atletas que têm um vínculo de equipe NO ANO da competição selecionada
        const atletasDoAno = atletas.filter(
          (a) => a.anoCompeticao === competicaoAtual.ano
        );
        setAtletasFiltrados(atletasDoAno);
      }
    } else {
      // Se nenhuma competição selecionada, mostra todos os atletas com vínculo
      setAtletasFiltrados(atletas.filter((a) => a.equipeNome));
    }
  }, [selectedCompId, atletas, competicoes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!atletaId || !equipeId || !selectedCompId) {
      setError(
        "Todos os campos (Competição, Atleta e Equipe) são obrigatórios."
      );
      return;
    }
    try {
      await vincularAtletaEquipe({
        atletaId: parseInt(atletaId, 10),
        equipeId: parseInt(equipeId, 10),
        competicaoId: parseInt(selectedCompId, 10),
      });
      setSuccess("Atleta vinculado com sucesso!");
      // Limpa o formulário e recarrega os atletas para atualizar a tabela
      setAtletaId("");
      setEquipeId("");
      setTimeout(
        () => getAtletasComEquipes().then((res) => setAtletas(res.data)),
        1000
      );
    } catch (err) {
      setError(err.response?.data?.erro || "Falha ao vincular atleta.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Gerenciar Vínculo Atleta-Equipe por Competição</Title>
      </Header>
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <label>1. Competição</label>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            required
          >
            <option value="">-- Escolha uma competição --</option>
            {competicoes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>2. Atleta</label>
          <select
            value={atletaId}
            onChange={(e) => setAtletaId(e.target.value)}
            required
          >
            <option value="">-- Escolha um atleta --</option>
            {atletas.map((a) => (
              <option key={a.atletaId} value={a.atletaId}>
                {a.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>3. Equipe</label>
          <select
            value={equipeId}
            onChange={(e) => setEquipeId(e.target.value)}
            required
          >
            <option value="">-- Escolha uma equipe --</option>
            {equipes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <Button type="submit">Vincular</Button>
      </FormContainer>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <h2>Vínculos Atuais</h2>
      <Table>
        <thead>
          <tr>
            <th>Atleta</th>
            <th>Equipe Vinculada</th>
            <th>Competição do Vínculo</th>
          </tr>
        </thead>
        <tbody>
          {/* A tabela agora mostra todos os vínculos */}
          {atletas
            .filter((a) => a.competicaoId)
            .map((atleta) => (
              <tr key={`${atleta.atletaId}-${atleta.competicaoId}`}>
                <td>{atleta.nome}</td>
                <td>{atleta.equipeNome}</td>
                <td>
                  {competicoes.find((c) => c.id === atleta.competicaoId)?.nome}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default VinculoAtletaEquipe;
