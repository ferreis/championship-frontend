// src/pages/Atletas/Atletas.js
import React, { useState, useEffect } from "react";
import { getAtletasComEquipes, deleteAtleta } from "../../api/atletaApi";
import AtletaForm from "./AtletaForm";
import styled from "styled-components";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
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

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageButton = styled(Button)`
  background-color: ${(props) => (props.active ? "#3498db" : "#f0f0f0")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#2980b9" : "#e0e0e0")};
  }
`;

const PageInfo = styled.span`
  font-size: 1rem;
  color: #555;
`;

const ItemsPerPageSelector = styled.div`
  margin-left: 20px;
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
    color: #555;
  }

  select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1rem;
  }
`;

const Atletas = () => {
  const [atletas, setAtletas] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [atletasPerPage, setAtletasPerPage] = useState(10); // Agora é um estado

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

  // Lógica de Paginação
  const indexOfLastAtleta = currentPage * atletasPerPage;
  const indexOfFirstAtleta = indexOfLastAtleta - atletasPerPage;
  const currentAtletas = atletas.slice(indexOfFirstAtleta, indexOfLastAtleta);

  const totalPages = Math.ceil(atletas.length / atletasPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handler para mudança na quantidade de itens por página
  const handleAtletasPerPageChange = (event) => {
    setAtletasPerPage(Number(event.target.value));
    setCurrentPage(1); // Volta para a primeira página ao mudar a quantidade de itens
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
        <>
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
              {/* Renderiza apenas os atletas da página atual */}
              {currentAtletas.map((atleta) => (
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

          {/* Controles de Paginação */}
          <PaginationControls>
            <PageButton
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>
            {/* Renderiza um botão para cada página */}
            {[...Array(totalPages)].map((_, index) => (
              <PageButton
                key={index + 1}
                onClick={() => paginate(index + 1)}
                active={index + 1 === currentPage}
              >
                {index + 1}
              </PageButton>
            ))}
            <PageButton
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </PageButton>
            <PageInfo>
              Página {currentPage} de {totalPages}
            </PageInfo>

            {/* Selector de Itens por Página */}
            <ItemsPerPageSelector>
              <label htmlFor="items-per-page">Itens por página:</label>
              <select
                id="items-per-page"
                value={atletasPerPage}
                onChange={handleAtletasPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </ItemsPerPageSelector>
          </PaginationControls>
        </>
      )}
    </Container>
  );
};

export default Atletas;
