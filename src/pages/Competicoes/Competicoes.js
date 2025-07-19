// src/pages/Competicoes/Competicoes.js
import React, { useState, useEffect } from "react";
import { getCompeticoes, deleteCompeticao } from "../../api/competicaoApi";
import CompeticaoForm from "./CompeticaoForm";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 30px;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
`;

const StyledButton = styled.button`
  background-color: ${(props) => (props.danger ? "#e74c3c" : "#3498db")};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  margin: 0 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.danger ? "#c0392b" : "#2980b9")};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;

  th,
  td {
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #2c3e50;
    color: #fff;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  a {
    text-decoration: none;
    color: #2980b9;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Competicoes = () => {
  const [competicoes, setCompeticoes] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCompeticao, setSelectedCompeticao] = useState(null);

  useEffect(() => {
    fetchCompeticoes();
  }, []);

  const fetchCompeticoes = async () => {
    try {
      const response = await getCompeticoes();
      setCompeticoes(response.data);
    } catch (err) {
      setError("Falha ao buscar competições.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta competição?")) {
      try {
        await deleteCompeticao(id);
        fetchCompeticoes();
      } catch (err) {
        setError("Falha ao deletar competição.");
        console.error(err);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedCompeticao(null);
    fetchCompeticoes();
  };

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <Container>
      <h1>Gerenciamento de Competições</h1>

      {showForm ? (
        <CompeticaoForm
          competicaoToEdit={selectedCompeticao}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedCompeticao(null);
          }}
        />
      ) : (
        <>
          <StyledButton onClick={() => setShowForm(true)}>
            + Adicionar Nova Competição
          </StyledButton>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Ano</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {competicoes.map((comp) => (
                <tr key={comp.id}>
                  <td>
                    <Link to={`/competicao/${comp.id}/detalhes`}>
                      {comp.nome}
                    </Link>
                  </td>
                  <td>{new Date(comp.dataInicio).toLocaleDateString()}</td>
                  <td>{new Date(comp.dataFim).toLocaleDateString()}</td>
                  <td>{comp.ano}</td>
                  <td>
                    <StyledButton
                      onClick={() => {
                        setSelectedCompeticao(comp);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </StyledButton>
                    <StyledButton danger onClick={() => handleDelete(comp.id)}>
                      Deletar
                    </StyledButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default Competicoes;
