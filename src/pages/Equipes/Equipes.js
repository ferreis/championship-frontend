// src/pages/Equipes/Equipes.js
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { getEquipes, deleteEquipe } from "../../api/equipeApi";
import { getPaises, getEstados } from "../../api/localizacaoApi";
import EquipeForm from "./EquipeForm";

// Reutilize os estilos dos componentes globais
import { Table } from "../../components/Table"; // Certifique-se de que este caminho está correto
import { Button } from "../../components/Button"; // Certifique-se de que este caminho está correto

// Estilos de Layout (iguais ao de Atletas para consistência)
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

// Estilos de Paginação (copiados do componente Atletas para consistência)
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

const Equipes = () => {
  const [equipes, setEquipes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState(null);

  // --- Estados para Paginação ---
  const [currentPage, setCurrentPage] = useState(1);
  const [equipesPerPage, setEquipesPerPage] = useState(10); // Valor padrão

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipesRes, paisesRes, estadosRes] = await Promise.all([
        getEquipes(),
        getPaises(),
        getEstados(),
      ]);
      setEquipes(equipesRes.data);
      setPaises(paisesRes.data);
      setEstados(estadosRes.data);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const paisMap = useMemo(
    () => paises.reduce((acc, p) => ({ ...acc, [p.id]: p.nome }), {}),
    [paises]
  );
  const estadoMap = useMemo(
    () => estados.reduce((acc, e) => ({ ...acc, [e.id]: e.nome }), {}),
    [estados]
  );

  const handleSave = async () => {
    setShowForm(false);
    fetchData(); // Recarrega todos os dados, garantindo que a lista esteja atualizada
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta equipe?")) {
      try {
        await deleteEquipe(id);
        handleSave(); // Recarrega a lista
      } catch (err) {
        console.error(err);
        alert("Falha ao deletar equipe.");
      }
    }
  };

  const handleEdit = (equipe) => {
    setSelectedEquipe(equipe);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedEquipe(null);
    setShowForm(true);
  };

  // --- Lógica de Paginação ---
  const indexOfLastEquipe = currentPage * equipesPerPage;
  const indexOfFirstEquipe = indexOfLastEquipe - equipesPerPage;
  const currentEquipes = equipes.slice(indexOfFirstEquipe, indexOfLastEquipe);

  const totalPages = Math.ceil(equipes.length / equipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEquipesPerPageChange = (event) => {
    setEquipesPerPage(Number(event.target.value));
    setCurrentPage(1); // Volta para a primeira página ao mudar a quantidade de itens
  };

  if (loading)
    return (
      <Container>
        <p>Carregando...</p>
      </Container>
    );
  if (error)
    return (
      <Container>
        <p>Erro: {error}</p>
      </Container>
    );

  return (
    <Container>
      <Header>
        <Title>Gerenciamento de Equipes</Title>
        {!showForm && (
          <Button onClick={handleAddNew}>Adicionar Nova Equipe</Button>
        )}
      </Header>

      {showForm ? (
        <EquipeForm
          equipeToEdit={selectedEquipe}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          paises={paises}
          estados={estados}
        />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>País</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza apenas as equipes da página atual */}
              {currentEquipes.map((equipe) => (
                <tr key={equipe.id}>
                  <td>{equipe.nome}</td>
                  <td>{equipe.tipo}</td>
                  <td>{equipe.paisId ? paisMap[equipe.paisId] : "N/A"}</td>
                  <td>
                    {equipe.estadoId ? estadoMap[equipe.estadoId] : "N/A"}
                  </td>
                  <td>
                    <Button onClick={() => handleEdit(equipe)}>Editar</Button>
                    <Button
                      className="delete"
                      onClick={() => handleDelete(equipe.id)}
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
                value={equipesPerPage}
                onChange={handleEquipesPerPageChange}
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

export default Equipes;
