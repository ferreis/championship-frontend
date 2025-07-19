import React, { useState } from "react";
import { ManagerContainer, FormContainer, Table, Button } from "./styles";
import { createCidade } from "../../api/localizacaoApi";

const CidadeManager = ({ cidades, estados, fetchCidades }) => {
  const [nome, setNome] = useState("");
  const [estadoId, setEstadoId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCidade({ nome, estadoId: parseInt(estadoId) });
      setNome("");
      setEstadoId("");
      fetchCidades();
    } catch (error) {
      console.error("Erro ao criar cidade", error);
    }
  };

  return (
    <ManagerContainer>
      <h3>Gerenciar Cidades</h3>
      <FormContainer onSubmit={handleSubmit}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Cidade"
          required
        />
        <select
          value={estadoId}
          onChange={(e) => setEstadoId(e.target.value)}
          required
        >
          <option value="">Selecione o Estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome} - {e.sigla}
            </option>
          ))}
        </select>
        <Button type="submit">Adicionar Cidade</Button>
      </FormContainer>
      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {cidades.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{estados.find((e) => e.id === c.estadoId)?.nome}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ManagerContainer>
  );
};

export default CidadeManager;
