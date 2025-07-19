// src/pages/Resultados/Resultados.js
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

import {
  getParticipacoes,
  deleteParticipacao,
} from "../../api/participacaoProvaApi";
import { getAtletasComEquipes } from "../../api/atletaApi";
import { getProvas } from "../../api/provaApi";
import { getCompeticoes } from "../../api/competicaoApi";
import { getEquipes } from "../../api/equipeApi";

import ResultadoForm from "./ResultadoForm";

const Container = styled.div`
  /* ... */
`;
const Table = styled.table`
  /* ... */
`;
const Button = styled.button`
  /* ... */
`;

const Resultados = () => {
  // Estados para os dados
  const [participacoes, setParticipacoes] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [provas, setProvas] = useState([]);
  const [competicoes, setCompeticoes] = useState([]);
  const [equipes, setEquipes] = useState([]);

  // Estados de controle da UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedParticipacao, setSelectedParticipacao] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          participacoesRes,
          atletasRes,
          provasRes,
          competicoesRes,
          equipesRes,
        ] = await Promise.all([
          getParticipacoes(),
          getAtletasComEquipes(),
          getProvas(),
          getCompeticoes(),
          getEquipes(),
        ]);

        setParticipacoes(participacoesRes.data);
        setAtletas(atletasRes.data);
        setProvas(provasRes.data);
        setCompeticoes(competicoesRes.data);
        setEquipes(equipesRes.data);

        setError(null);
      } catch (err) {
        setError("Falha ao carregar os dados de resultados.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mapeia IDs para nomes para renderizar a tabela de forma legível
  const atletaMap = useMemo(
    () => atletas.reduce((acc, a) => ({ ...acc, [a.atletaId]: a.nome }), {}),
    [atletas]
  );
  const provaMap = useMemo(
    () => provas.reduce((acc, p) => ({ ...acc, [p.id]: p.nome }), {}),
    [provas]
  );
  const competicaoMap = useMemo(
    () => competicoes.reduce((acc, c) => ({ ...acc, [c.id]: c.nome }), {}),
    [competicoes]
  );

  const handleSave = async () => {
    setShowForm(false);
    setLoading(true);
    try {
      const response = await getParticipacoes();
      setParticipacoes(response.data);
    } catch (err) {
      setError("Falha ao recarregar resultados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este resultado?")) {
      try {
        await deleteParticipacao(id);
        handleSave(); // Recarrega
      } catch (err) {
        console.error(err);
        alert("Falha ao remover resultado.");
      }
    }
  };

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <Container>
      <h1>Lançamento de Resultados</h1>
      {showForm ? (
        <ResultadoForm
          participacaoToEdit={selectedParticipacao}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          atletas={atletas}
          equipes={equipes}
          provas={provas}
          competicoes={competicoes}
        />
      ) : (
        <>
          <Button
            onClick={() => {
              setSelectedParticipacao(null);
              setShowForm(true);
            }}
          >
            Lançar Novo Resultado
          </Button>
          <Table>
            <thead>
              <tr>
                <th>Competição</th>
                <th>Prova</th>
                <th>Atleta</th>
                <th>Tempo</th>
                <th>Colocação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {participacoes.map((item) => (
                <tr key={item.id}>
                  <td>{competicaoMap[item.competicaoId] || "N/A"}</td>
                  <td>{provaMap[item.provaId] || "N/A"}</td>
                  <td>{atletaMap[item.atletaId] || "N/A"}</td>
                  <td>{item.tempo || "-"}</td>
                  <td>{item.colocacao || "-"}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setSelectedParticipacao(item);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button onClick={() => handleDelete(item.id)}>
                      Excluir
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

export default Resultados;
