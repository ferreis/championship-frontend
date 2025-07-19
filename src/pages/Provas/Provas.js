// src/pages/Provas/Provas.js
import React, { useState, useEffect } from "react";
import { getProvas, deleteProva } from "../../api/provaApi";
import ProvaForm from "./ProvaForm"; // Importa o formulário
import styled from "styled-components";

// Estilos para a página e tabela
const ProvasContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  th {
    background-color: #e9ecef;
  }
  tr:nth-child(even) {
    background-color: #f8f9fa;
  }
  tr:hover {
    background-color: #e2e6ea;
  }
`;

const Button = styled.button`
  /* ... estilos para botões ... */
`;

const Provas = () => {
  const [provas, setProvas] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProva, setSelectedProva] = useState(null);

  useEffect(() => {
    fetchProvas();
  }, []);

  const fetchProvas = async () => {
    try {
      const response = await getProvas();
      setProvas(response.data);
      setError(null);
    } catch (err) {
      setError("Falha ao buscar provas.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta prova?")) {
      try {
        await deleteProva(id);
        fetchProvas(); // Atualiza a lista
      } catch (err) {
        setError("Falha ao deletar prova.");
        console.error(err);
      }
    }
  };

  const handleEdit = (prova) => {
    setSelectedProva(prova);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedProva(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedProva(null);
    fetchProvas();
  };

  if (error && !provas.length) {
    return <div>Erro: {error}</div>;
  }

  return (
    <ProvasContainer>
      <h1>Gerenciamento de Provas</h1>

      {showForm ? (
        <ProvaForm
          provaToEdit={selectedProva}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <Button onClick={handleAddNew}>Adicionar Nova Prova</Button>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Modalidade</th>
                <th>Avaliação</th>
                <th>Gênero</th>
                <th>Categoria Etária</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {provas.map((prova) => (
                <tr key={prova.id}>
                  <td>{prova.nome}</td>
                  <td>{prova.tipo}</td>
                  <td>{prova.modalidade}</td>
                  <td>{prova.tempoOuColocacao}</td>
                  <td>{prova.genero}</td>
                  <td>{prova.categoriaEtaria}</td>
                  <td>
                    <Button onClick={() => handleEdit(prova)}>Editar</Button>
                    <Button onClick={() => handleDelete(prova.id)}>
                      Deletar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </ProvasContainer>
  );
};

export default Provas;
