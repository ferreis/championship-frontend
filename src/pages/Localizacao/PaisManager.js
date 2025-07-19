import React, { useState } from "react";
import { ManagerContainer, FormContainer, Table, Button } from "./styles";
import { createPais, updatePais, deletePais } from "../../api/localizacaoApi";

const PaisManager = ({ paises, fetchPaises }) => {
  const [nome, setNome] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  // Adicione estados para edição se necessário

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPais({ nome, nacionalidade });
      setNome("");
      setNacionalidade("");
      fetchPaises(); // Atualiza a lista no componente pai
    } catch (error) {
      console.error("Erro ao criar país", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este país?")) {
      await deletePais(id);
      fetchPaises();
    }
  };

  return (
    <ManagerContainer>
      <h3>Gerenciar Países</h3>
      <FormContainer onSubmit={handleSubmit}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do País"
          required
        />
        <input
          value={nacionalidade}
          onChange={(e) => setNacionalidade(e.target.value)}
          placeholder="Nacionalidade"
          required
        />
        <Button type="submit">Adicionar País</Button>
      </FormContainer>
      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nacionalidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paises.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.nacionalidade}</td>
              <td>
                <Button className="delete" onClick={() => handleDelete(p.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ManagerContainer>
  );
};

export default PaisManager;
