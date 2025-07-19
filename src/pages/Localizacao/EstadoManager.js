import React, { useState } from "react";
import { ManagerContainer, FormContainer, Table, Button } from "./styles";
import { createEstado } from "../../api/localizacaoApi";

const EstadoManager = ({ estados, paises, fetchEstados }) => {
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [paisId, setPaisId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEstado({ nome, sigla, paisId: parseInt(paisId) });
      // Limpa o formulário
      setNome("");
      setSigla("");
      setPaisId("");
      fetchEstados();
    } catch (error) {
      console.error("Erro ao criar estado", error);
    }
  };

  return (
    <ManagerContainer>
      <h3>Gerenciar Estados</h3>
      <FormContainer onSubmit={handleSubmit}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Estado"
          required
        />
        <input
          value={sigla}
          onChange={(e) => setSigla(e.target.value)}
          placeholder="Sigla"
          required
        />
        <select
          value={paisId}
          onChange={(e) => setPaisId(e.target.value)}
          required
        >
          <option value="">Selecione o País</option>
          {paises.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        <Button type="submit">Adicionar Estado</Button>
      </FormContainer>
      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sigla</th>
            <th>País</th>
          </tr>
        </thead>
        <tbody>
          {estados.map((e) => (
            <tr key={e.id}>
              <td>{e.nome}</td>
              <td>{e.sigla}</td>
              <td>{paises.find((p) => p.id === e.paisId)?.nome}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ManagerContainer>
  );
};

export default EstadoManager;
