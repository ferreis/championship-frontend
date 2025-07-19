import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
} from "react-router-dom";
import styled from "styled-components";
import Competicoes from "./pages/Competicoes/Competicoes";
import Provas from "./pages/Provas/Provas";
import Atletas from "./pages/Atletas/Atletas";
import Localizacao from "./pages/Localizacao/Localizacao";
import Equipes from "./pages/Equipes/Equipes";
import Resultados from "./pages/Resultados/Resultados";
import Pontuacoes from "./pages/Pontuacoes/Pontuacoes";
import CompeticaoDetalhes from "./pages/Competicoes/CompeticaoDetalhes";
import Inscricao from "./pages/Inscricao/Inscricao";
import VinculoAtletaEquipe from "./pages/Vinculo/VinculoAtletaEquipe";
import GerenciarInscricoes from "./pages/GerenciarInscricoes/GerenciarInscricoes";

const Home = () => (
  <div>
    <h1>Bem-vindo ao Sistema de Gerenciamento de Campeonatos</h1>
    <p>
      Utilize a navegação acima para gerenciar as diferentes seções do sistema.
    </p>
  </div>
);

// --- Estilização com Styled Components ---
const AppContainer = styled.div`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const NavBar = styled.nav`
  background-color: #2c3e50;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

const NavItem = styled(NavLink)`
  color: #ecf0f1;
  padding: 20px 25px;
  text-decoration: none;
  font-weight: bold;
  display: block;
  transition: background-color 0.3s;

  &.active {
    background-color: #3498db;
    color: white;
  }

  &:hover {
    background-color: #34495e;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <NavBar>
          <ul>
            <li>
              <NavItem to="/">Início</NavItem>
            </li>
            <li>
              <NavItem to="/vinculo-atleta-equipe">Vincular Atletas</NavItem>
            </li>
            <li>
              <NavItem to="/competicoes">Competições</NavItem>
            </li>
            <li>
              <NavItem to="/provas">Provas</NavItem>
            </li>
            <li>
              <NavItem to="/atletas">Atletas</NavItem>
            </li>
            <li>
              <NavItem to="/equipes">Equipes</NavItem>
            </li>
            <li>
              <NavItem to="/participacoes">Resultados</NavItem>
            </li>
            <li>
              <NavItem to="/pontuacoes">Pontuações</NavItem>
            </li>
            <li>
              <NavItem to="/localizacao">Localização</NavItem>
            </li>
            <li>
              <NavItem to="/inscricoes">Inscrições</NavItem>
            </li>
          </ul>
        </NavBar>

        <MainContent>
          {/* Define qual componente será renderizado com base na URL */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/competicoes" element={<Competicoes />} />;
            <Route path="/provas" element={<Provas />} />;
            <Route path="/atletas" element={<Atletas />} />;
            <Route path="/equipes" element={<Equipes />} />
            <Route path="/participacoes" element={<Resultados />} />
            <Route path="/pontuacoes" element={<Pontuacoes />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route
              path="/competicao/:id/detalhes"
              element={<CompeticaoDetalhes />}
            />
            <Route path="/inscricao/:competicaoId" element={<Inscricao />} />
            <Route
              path="/vinculo-atleta-equipe"
              element={<VinculoAtletaEquipe />}
            />
            <Route path="/inscricoes" element={<GerenciarInscricoes />} />
            <Route
              path="/competicao/:id/detalhes"
              element={<CompeticaoDetalhes />}
            />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
