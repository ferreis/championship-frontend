// src/pages/Competicoes/Competicoes.js
import React, { useState, useEffect } from "react";
import { getCompeticoes, deleteCompeticao } from "../../api/competicaoApi";
import CompeticaoForm from "./CompeticaoForm"; // Importa o formulário
import styled from "styled-components";
import { Link } from "react-router-dom";

// Estilos para a página e tabela
const CompeticoesContainer = styled.div`
  /* ... estilos ... */
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
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
        fetchCompeticoes(); // Atualiza a lista
      } catch (err) {
        setError("Falha ao deletar competição.");
        console.error(err);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedCompeticao(null);
    fetchCompeticoes(); // Recarrega os dados após salvar
  };

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <CompeticoesContainer>
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
          <button onClick={() => setShowForm(true)}>
            Adicionar Nova Competição
          </button>
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
                    {" "}
                    <Link to={`/competicao/${comp.id}/detalhes`}>
                      {comp.nome}
                    </Link>
                  </td>
                  <td>{new Date(comp.dataInicio).toLocaleDateString()}</td>
                  <td>{new Date(comp.dataFim).toLocaleDateString()}</td>
                  <td>{comp.ano}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedCompeticao(comp);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete(comp.id)}>
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </CompeticoesContainer>
  );
};

export default Competicoes;
