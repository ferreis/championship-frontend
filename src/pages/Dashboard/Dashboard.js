// src/pages/Dashboard/Dashboard.js
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const Dashboard = () => {
  return (
    <Container>
      <Title>Dashboard</Title>
      <p>
        Bem-vindo ao painel principal. Aqui ficará um resumo das competições e
        atividades recentes.
      </p>
      {/* Futuramente, aqui entrarão os cards e gráficos de resumo. */}
    </Container>
  );
};

export default Dashboard;
