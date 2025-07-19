// src/pages/Equipes/Equipes.js
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { getEquipes, deleteEquipe } from "../../api/equipeApi";
import { getPaises, getEstados } from "../../api/localizacaoApi";
import EquipeForm from "./EquipeForm";

// Reutilize os estilos
const Container = styled.div`
  /* ... */
`;
const Table = styled.table`
  /* ... */
`;
const Button = styled.button`
  /* ... */
`;

const Equipes = () => {
  const [equipes, setEquipes] = useState([]);
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Busca todos os dados em paralelo
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
    fetchData();
  }, []);

  // Mapeia IDs para nomes para fácil consulta na renderização
  // useMemo evita recalcular isso a cada renderização
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
    setLoading(true);
    try {
      const response = await getEquipes();
      setEquipes(response.data);
    } catch (err) {
      setError("Falha ao recarregar equipes.");
    } finally {
      setLoading(false);
    }
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <Container>
      <h1>Gerenciamento de Equipes</h1>
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
          <Button
            onClick={() => {
              setSelectedEquipe(null);
              setShowForm(true);
            }}
          >
            Adicionar Nova Equipe
          </Button>
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
              {equipes.map((equipe) => (
                <tr key={equipe.id}>
                  <td>{equipe.nome}</td>
                  <td>{equipe.tipo}</td>
                  <td>{equipe.paisId ? paisMap[equipe.paisId] : "N/A"}</td>
                  <td>
                    {equipe.estadoId ? estadoMap[equipe.estadoId] : "N/A"}
                  </td>
                  <td>
                    <Button onClick={() => handleEdit(equipe)}>Editar</Button>
                    <Button onClick={() => handleDelete(equipe.id)}>
                      Deletar
                    </Button>
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

export default Equipes;
