// src/pages/Atletas/Atletas.js
import React, { useState, useEffect } from "react";
import { getAtletasComEquipes, deleteAtleta } from "../../api/atletaApi";
import AtletaForm from "./AtletaForm";
import styled from "styled-components";

// ... (reutilize os estilos de Container, Table, Button das outras telas) ...
const AtletasContainer = styled.div`
  /* ... */
`;
const Table = styled.table`
  /* ... */
`;
const Button = styled.button`
  /* ... */
`;

const Atletas = () => {
  const [atletas, setAtletas] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);

  useEffect(() => {
    fetchAtletas();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este atleta?")) {
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
    <AtletasContainer>
      <h1>Gerenciamento de Atletas</h1>
      {showForm ? (
        <AtletaForm
          atletaToEdit={selectedAtleta}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <Button onClick={handleAddNew}>Adicionar Novo Atleta</Button>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Gênero</th>
                <th>Nacionalidade</th>
                <th>Equipe Atual</th>
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
                  <td>{atleta.equipeNome || "Sem equipe"}</td>
                  <td>
                    <Button onClick={() => handleEdit(atleta)}>Editar</Button>
                    <Button onClick={() => handleDelete(atleta.atletaId)}>
                      Deletar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </AtletasContainer>
  );
};

export default Atletas;
