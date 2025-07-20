// src/pages/Atletas/Atletas.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getAtletasComEquipes, deleteAtleta } from "../../api/atletaApi";
import { getCompeticoes } from "../../api/competicaoApi";
import AtletaForm from "./AtletaForm";
import styled from "styled-components";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";

// --- Estilos (sem alterações) ---
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
const FilterContainer = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;
const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #495057;
  }
  select {
    width: 100%;
    max-width: 400px;
    padding: 0.75rem;
    border-radius: 5px;
    border: 1px solid #ced4da;
    font-size: 1rem;
  }
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
`;
const PageButton = styled.button`
  margin: 0 4px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? "#007bff" : "#ddd")};
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#007bff" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.2s ease;
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
  select {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ced4da;
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

// --- Componente ---
const Atletas = () => {
  // Estados da tabela e paginação
  const [atletas, setAtletas] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Estados dos filtros
  const [competicoes, setCompeticoes] = useState([]);
  const [filterCompId, setFilterCompId] = useState("");

  // Estados de UI
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAtleta, setSelectedAtleta] = useState(null);

  const fetchAtletas = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        competicaoId: filterCompId || undefined,
      };
      const response = await getAtletasComEquipes(filters);
      setAtletas(response.data.items || []);
      setTotalItems(response.data.totalCount || 0);
      setError(null);
    } catch (err) {
      setError("Falha ao buscar atletas.");
      setAtletas([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterCompId]);

  useEffect(() => {
    fetchAtletas();
  }, [fetchAtletas]);

  useEffect(() => {
    const fetchCompeticoesParaFiltro = async () => {
      try {
        const response = await getCompeticoes();
        setCompeticoes(response.data || []);
      } catch (error) {
        console.error("Falha ao buscar competições", error);
      }
    };
    fetchCompeticoesParaFiltro();
  }, []);

  const atletasUnicos = useMemo(() => {
    if (filterCompId) {
      return atletas;
    }
    return [...new Map(atletas.map((item) => [item.atletaId, item])).values()];
  }, [atletas, filterCompId]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja deletar este atleta e todos os seus registros de participação?"
      )
    ) {
      try {
        await deleteAtleta(id);
        if (atletas.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchAtletas();
        }
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
          <FilterContainer>
            <FormGroup>
              <label>Filtrar por Competição</label>
              <select
                value={filterCompId}
                onChange={(e) => {
                  setFilterCompId(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Ver lista consolidada de atletas</option>
                {competicoes.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.nome}
                  </option>
                ))}
              </select>
            </FormGroup>
          </FilterContainer>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Gênero</th>
                <th>Nacionalidade</th>
                {filterCompId && <th>Equipe (Competição)</th>}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={filterCompId ? 6 : 5}
                    style={{ textAlign: "center" }}
                  >
                    Carregando...
                  </td>
                </tr>
              ) : (
                atletasUnicos.map((atleta) => (
                  <tr key={atleta.atletaId}>
                    <td>{atleta.nome}</td>
                    <td>{atleta.cpf}</td>
                    <td>{atleta.genero}</td>
                    <td>{atleta.nacionalidade}</td>
                    {filterCompId && (
                      <td>
                        {atleta.equipeNome
                          ? `${atleta.equipeNome}`
                          : "Individual"}
                      </td>
                    )}
                    <td>
                      <ActionButtonContainer>
                        <ActionButton
                          className="edit"
                          onClick={() => handleEdit(atleta)}
                        >
                          Editar
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => handleDelete(atleta.atletaId)}
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
                | Exibindo {atletas.length} de {totalItems}
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

export default Atletas;
