// src/pages/Vinculo/VinculoAtletaEquipe.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAtletasComEquipes,
  vincularAtletaEquipe,
} from "../../api/atletaApi";
import { getEquipes } from "../../api/equipeApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";

const Container = styled.div`
  max-width: 960px;
  margin: auto;
`;

const FormContainer = styled.div`
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

const VinculoAtletaEquipe = () => {
  const [atletas, setAtletas] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [atletaId, setAtletaId] = useState("");
  const [equipeId, setEquipeId] = useState("");
  const [anoCompeticao, setAnoCompeticao] = useState(new Date().getFullYear());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      const [atletasRes, equipesRes] = await Promise.all([
        getAtletasComEquipes(),
        getEquipes(),
      ]);
      setAtletas(atletasRes.data);
      setEquipes(equipesRes.data);
    } catch (err) {
      setError("Falha ao carregar dados.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!atletaId || !equipeId || !anoCompeticao) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    try {
      await vincularAtletaEquipe({
        atletaId: parseInt(atletaId, 10),
        equipeId: parseInt(equipeId, 10),
        anoCompeticao: parseInt(anoCompeticao, 10),
      });
      setSuccess("Atleta vinculado com sucesso!");
      // Recarrega os dados para mostrar o vínculo na tabela
      fetchData();
    } catch (err) {
      setError(err.response?.data?.erro || "Falha ao vincular atleta.");
    }
  };

  return (
    <Container>
      <h1>Vincular Atleta a uma Equipe</h1>
      <FormContainer as="form" onSubmit={handleSubmit}>
        <FormGroup>
          <label>Selecionar Atleta</label>
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
          <label>Selecionar Equipe</label>
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
        <FormGroup>
          <label>Ano</label>
          <input
            type="number"
            value={anoCompeticao}
            onChange={(e) => setAnoCompeticao(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Vincular</Button>
      </FormContainer>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <h2>Vínculos Atuais</h2>
      <Table>
        <thead>
          <tr>
            <th>Atleta</th>
            <th>Equipe</th>
            <th>Ano</th>
          </tr>
        </thead>
        <tbody>
          {atletas
            .filter((a) => a.equipeNome)
            .map((atleta) => (
              <tr key={`${atleta.atletaId}-${atleta.anoCompeticao}`}>
                <td>{atleta.nome}</td>
                <td>{atleta.equipeNome}</td>
                <td>{atleta.anoCompeticao}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default VinculoAtletaEquipe;
