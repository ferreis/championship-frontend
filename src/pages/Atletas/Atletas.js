// src/pages/Atletas/Atletas.js
import React, { useState, useEffect } from "react";
import { getAtletasComEquipes, deleteAtleta } from "../../api/atletaApi";
import AtletaForm from "./AtletaForm";
import styled from "styled-components";
import { Table } from "../../components/Table"; // Componente de Tabela melhorado
import { Button } from "../../components/Button"; // Componente de Botão melhorado

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
`;

const Atletas = () => {
  const [atletas, setAtletas] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);

  const fetchAtletas = async () => {
    try {
      const response = await getAtletasComEquipes();
      setAtletas(response.data);
      setError(null);
    } catch (err) {
      setError("Falha ao buscar atletas.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAtletas();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja deletar este atleta e todos os seus registros de participação?"
      )
    ) {
      try {
        await deleteAtleta(id);
        fetchAtletas();
      } catch (err) {
        setError("Falha ao deletar atleta.");
        console.error(err);
      }
    }
  };

  const handleEdit = (atleta) => {
    setSelectedAtleta(atleta);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedAtleta(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    fetchAtletas();
  };

  if (error && !atletas.length) {
    return <div>Erro: {error}</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Atletas</Title>
        {!showForm && (
          <Button onClick={handleAddNew}>Adicionar Novo Atleta</Button>
        )}
      </Header>

      {showForm ? (
        <AtletaForm
          atletaToEdit={selectedAtleta}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Gênero</th>
              <th>Nacionalidade</th>
              <th>Equipe (Ano)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map((atleta) => (
              <tr key={atleta.atletaId}>
                <td>{atleta.nome}</td>
                <td>{atleta.cpf}</td>
                <td>{atleta.genero}</td>
                <td>{atleta.nacionalidade}</td>
                <td>
                  {atleta.equipeNome
                    ? `${atleta.equipeNome} (${atleta.anoCompeticao})`
                    : "Individual"}
                </td>
                <td>
                  <Button onClick={() => handleEdit(atleta)}>Editar</Button>
                  <Button
                    className="delete"
                    onClick={() => handleDelete(atleta.atletaId)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Atletas;
