// src/pages/Provas/Provas.js
import React, { useState, useEffect, useCallback } from "react";
import { getProvas, deleteProva } from "../../api/provaApi";
import ProvaForm from "./ProvaForm";
import styled from "styled-components";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";

// Estilos
const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 30px;
  background-color: #f9fafb;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
  font-size: 1.8rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
`;

const PageButton = styled.button`
  margin: 0 4px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? "#007bff" : "#ddd")};
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#007bff" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  transition: all 0.2s ease;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:not(:disabled):hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
  }
`;

const ItemsPerPageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-weight: 500;
  select {
    padding: 5px 8px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    background: #fff;
    transition: border-color 0.2s;
    &:focus {
      border-color: #3498db;
    }
  }
`;

const ActionButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: white;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.85;
  }
  &.edit {
    background-color: #007bff;
  }
  &.delete {
    background-color: #dc3545;
  }
`;

const Provas = () => {
  const [provas, setProvas] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProva, setSelectedProva] = useState(null);

  const fetchProvas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProvas(currentPage, itemsPerPage);
      setProvas(response.data.items || []);
      setTotalItems(response.data.totalCount || 0);
    } catch (err) {
      setError("Falha ao buscar provas.");
      setProvas([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProvas();
  }, [fetchProvas]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta prova?")) {
      try {
        await deleteProva(id);
        if (provas.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchProvas();
        }
      } catch (err) {
        setError("Falha ao deletar prova.");
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
    fetchProvas();
  };

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Provas</Title>
        {!showForm && (
          <Button onClick={handleAddNew}>+ Adicionar Nova Prova</Button>
        )}
      </Header>

      {showForm ? (
        <ProvaForm
          provaToEdit={selectedProva}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
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
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Carregando...
                  </td>
                </tr>
              ) : (
                provas.map((prova) => (
                  <tr key={prova.id}>
                    <td>{prova.nome}</td>
                    <td>{prova.tipo}</td>
                    <td>{prova.modalidade}</td>
                    <td>{prova.tempoOuColocacao}</td>
                    <td>{prova.genero}</td>
                    <td>{prova.categoriaEtaria}</td>
                    <td>
                      <ActionButtonContainer>
                        <ActionButton
                          className="edit"
                          onClick={() => handleEdit(prova)}
                        >
                          Editar
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => handleDelete(prova.id)}
                        >
                          Deletar
                        </ActionButton>
                      </ActionButtonContainer>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <PaginationContainer>
            <ItemsPerPageSelector>
              <label>Itens por página:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>
                | Exibindo {provas.length} de {totalItems}
              </span>
            </ItemsPerPageSelector>
            <PageControls>
              <PageButton
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </PageButton>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <PageButton
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próximo
              </PageButton>
            </PageControls>
          </PaginationContainer>
        </>
      )}
    </Container>
  );
};

export default Provas;
