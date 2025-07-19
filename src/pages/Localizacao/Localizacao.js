// src/pages/Localizacao/Localizacao.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getPaises, getEstados, getCidades } from "../../api/localizacaoApi";
import PaisManager from "./PaisManager";
import EstadoManager from "./EstadoManager";
import CidadeManager from "./CidadeManager";

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #ccc;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${(props) => (props.active ? "#ccc" : "transparent")};
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-bottom: ${(props) => (props.active ? "2px solid #007bff" : "none")};
`;

const ContentContainer = styled.div`
  margin-top: -2px; /* Alinha com a borda da tab */
  border: 2px solid #ccc;
  border-top: none;
  padding: 20px;
`;

const Localizacao = () => {
  const [activeTab, setActiveTab] = useState("paises");
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paisesRes, estadosRes, cidadesRes] = await Promise.all([
        getPaises(),
        getEstados(),
        getCidades(),
      ]);
      setPaises(paisesRes.data);
      setEstados(estadosRes.data);
      setCidades(cidadesRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados de localização", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <Container>
      <h1>Configurações de Localização</h1>
      <TabContainer>
        <TabButton
          active={activeTab === "paises"}
          onClick={() => setActiveTab("paises")}
        >
          Países
        </TabButton>
        <TabButton
          active={activeTab === "estados"}
          onClick={() => setActiveTab("estados")}
        >
          Estados
        </TabButton>
        <TabButton
          active={activeTab === "cidades"}
          onClick={() => setActiveTab("cidades")}
        >
          Cidades
        </TabButton>
      </TabContainer>
      <ContentContainer>
        {activeTab === "paises" && (
          <PaisManager paises={paises} fetchPaises={fetchData} />
        )}
        {activeTab === "estados" && (
          <EstadoManager
            estados={estados}
            paises={paises}
            fetchEstados={fetchData}
          />
        )}
        {activeTab === "cidades" && (
          <CidadeManager
            cidades={cidades}
            estados={estados}
            fetchCidades={fetchData}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default Localizacao;
