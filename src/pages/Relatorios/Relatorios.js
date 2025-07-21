// src/pages/Relatorios/Relatorios.js
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const Relatorios = () => {
  return (
    <Container>
      <Title>Relatórios</Title>
      <p>
        Nesta seção será possível gerar relatórios personalizados e exportar
        dados em formatos como PDF e Excel.
      </p>
      {/* Futuramente, aqui entrarão os filtros e o botão de gerar relatório. */}
    </Container>
  );
};

export default Relatorios;
