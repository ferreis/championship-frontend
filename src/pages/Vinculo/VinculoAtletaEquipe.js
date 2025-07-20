// src/pages/Vinculo/VinculoAtletaEquipe.js
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  getAtletasComEquipes,
  vincularAtletaEquipe,
} from "../../api/atletaApi";
import { getEquipes } from "../../api/equipeApi";
import { getCompeticoes } from "../../api/competicaoApi";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";

// --- Estilos ---
const Container = styled.div`
  max-width: 1024px;
  margin: auto;
`;
const Header = styled.div`
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
`;
const Subtitle = styled.h2`
  color: #34495e;
  margin-top: 2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
`;
const FormContainer = styled.form`
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: flex-end;
`;
const FormGroup = styled.div`
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
const Message = styled.p`
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  color: white;
  font-weight: bold;
  background-color: ${(props) =>
    props.type === "success" ? "#28a745" : "#dc3545"};
`;

// ### ESTILOS CORRIGIDOS PARA O FILTRO ###
const ThFilterable = styled.th`
  vertical-align: top;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
`;

const ThHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterIcon = styled.span`
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  color: #7f8c8d;
  &:hover {
    color: #2c3e50;
  }
`;

const FilterWrapper = styled.div`
  margin-top: 8px;
  select {
    width: 100%;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #bdc3c7;
  }
`;

// ### PAGINAÇÃO ESTILIZADA (sem alterações) ###
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

// --- Componente ---
const VinculoAtletaEquipe = () => {
  // Todos os `useState` e `useEffect` hooks continuam os mesmos da versão anterior.
  // ...
  // Estados para os dropdowns
  const [allAtletas, setAllAtletas] = useState([]);
  const [allEquipes, setAllEquipes] = useState([]);
  const [allCompeticoes, setAllCompeticoes] = useState([]);

  // Estados do Formulário de criação
  const [formCompId, setFormCompId] = useState("");
  const [formAtletaId, setFormAtletaId] = useState("");
  const [formEquipeId, setFormEquipeId] = useState("");

  // Estados dos Filtros da tabela
  const [filterCompId, setFilterCompId] = useState("");
  const [filterEquipeId, setFilterEquipeId] = useState("");
  const [filterAtletaId, setFilterAtletaId] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  // Estados da Tabela e Paginação
  const [vinculos, setVinculos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

  // Estados de UI
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVinculos = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        competicaoId: filterCompId || undefined,
        equipeId: filterEquipeId || undefined,
        atletaId: filterAtletaId || undefined,
      };
      const response = await getAtletasComEquipes(filters);
      setVinculos(response?.data?.items || []);
      setTotalItems(response?.data?.totalCount || 0);
    } catch (err) {
      setError("Falha ao carregar vínculos.");
      setVinculos([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterCompId, filterEquipeId, filterAtletaId]);

  useEffect(() => {
    fetchVinculos();
  }, [fetchVinculos]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [compRes, equipesRes, atletasRes] = await Promise.all([
          getCompeticoes(),
          getEquipes(),
          getAtletasComEquipes({ pageSize: 1000 }),
        ]);
        setAllCompeticoes(compRes?.data || []);
        setAllEquipes(equipesRes?.data || []);
        setAllAtletas(atletasRes?.data?.items || []);
      } catch (err) {
        setError("Falha ao carregar dados para os filtros.");
        setAllCompeticoes([]);
        setAllEquipes([]);
        setAllAtletas([]);
      }
    };
    fetchDropdownData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formAtletaId || !formEquipeId || !formCompId) {
      setError("Todos os campos são obrigatórios para criar um vínculo.");
      return;
    }
    try {
      await vincularAtletaEquipe({
        atletaId: parseInt(formAtletaId),
        equipeId: parseInt(formEquipeId),
        competicaoId: parseInt(formCompId),
      });
      setSuccess("Atleta vinculado com sucesso!");
      setFormAtletaId("");
      setFormEquipeId("");
      setFormCompId("");
      fetchVinculos();
    } catch (err) {
      setError(err.response?.data?.erro || "Falha ao vincular atleta.");
    }
  };

  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  return (
    <Container>
      <Header>
        <Title>Gerenciar Vínculos (Atleta x Equipe x Competição)</Title>
      </Header>
      <Subtitle>Criar Novo Vínculo</Subtitle>
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <label>Competição</label>
          <select
            value={formCompId}
            onChange={(e) => setFormCompId(e.target.value)}
            required
          >
            <option value="">-- Escolha --</option>
            {allCompeticoes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Atleta</label>
          <select
            value={formAtletaId}
            onChange={(e) => setFormAtletaId(e.target.value)}
            required
          >
            <option value="">-- Escolha --</option>
            {allAtletas.map((a) => (
              <option key={a.atletaId} value={a.atletaId}>
                {a.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Equipe</label>
          <select
            value={formEquipeId}
            onChange={(e) => setFormEquipeId(e.target.value)}
            required
          >
            <option value="">-- Escolha --</option>
            {allEquipes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </FormGroup>
        <Button type="submit">Vincular</Button>
      </FormContainer>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <Subtitle>Vínculos Atuais</Subtitle>

      <Table>
        <thead>
          {/* ##### ESTRUTURA DO CABEÇALHO CORRIGIDA ##### */}
          <tr>
            <ThFilterable>
              <ThHeader>
                <span>Atleta</span>
                <FilterIcon onClick={() => toggleFilter("atleta")}>
                  &#128269;
                </FilterIcon>
              </ThHeader>
              {activeFilter === "atleta" && (
                <FilterWrapper>
                  <select
                    value={filterAtletaId}
                    onChange={(e) => {
                      setFilterAtletaId(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Todos</option>
                    {allAtletas.map((a) => (
                      <option key={a.atletaId} value={a.atletaId}>
                        {a.nome}
                      </option>
                    ))}
                  </select>
                </FilterWrapper>
              )}
            </ThFilterable>
            <ThFilterable>
              <ThHeader>
                <span>Equipe</span>
                <FilterIcon onClick={() => toggleFilter("equipe")}>
                  &#128269;
                </FilterIcon>
              </ThHeader>
              {activeFilter === "equipe" && (
                <FilterWrapper>
                  <select
                    value={filterEquipeId}
                    onChange={(e) => {
                      setFilterEquipeId(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Todas</option>
                    {allEquipes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                </FilterWrapper>
              )}
            </ThFilterable>
            <ThFilterable>
              <ThHeader>
                <span>Competição</span>
                <FilterIcon onClick={() => toggleFilter("competicao")}>
                  &#128269;
                </FilterIcon>
              </ThHeader>
              {activeFilter === "competicao" && (
                <FilterWrapper>
                  <select
                    value={filterCompId}
                    onChange={(e) => {
                      setFilterCompId(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Todas</option>
                    {allCompeticoes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </FilterWrapper>
              )}
            </ThFilterable>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Carregando...
              </td>
            </tr>
          ) : (
            vinculos.map((atleta) => (
              <tr key={`${atleta.atletaId}-${atleta.competicaoId}`}>
                <td>{atleta.nome}</td>
                <td>{atleta.equipeNome}</td>
                <td>
                  {
                    (allCompeticoes || []).find(
                      (c) => c.id === atleta.competicaoId
                    )?.nome
                  }
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* A paginação continua a mesma */}
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
            | Exibindo {vinculos.length} de {totalItems}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </PageButton>
        </PageControls>
      </PaginationContainer>
    </Container>
  );
};

export default VinculoAtletaEquipe;
