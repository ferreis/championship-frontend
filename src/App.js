// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import styled from "styled-components";

// Importando as páginas existentes
import Atletas from "./pages/Atletas/Atletas";
import Competicoes from "./pages/Competicoes/Competicoes";
import CompeticaoDetalhes from "./pages/Competicoes/CompeticaoDetalhes";
import Equipes from "./pages/Equipes/Equipes";
import GerenciarInscricoes from "./pages/Inscricoes/Inscricoes"; // Renomeie o arquivo se necessário
import Localizacao from "./pages/Localizacao/Localizacao";
import Pontuacoes from "./pages/Pontuacoes/Pontuacoes";
import Provas from "./pages/Provas/Provas";
import VinculoAtletaEquipe from "./pages/Vinculo/VinculoAtletaEquipe";

// Importando as NOVAS páginas
import Dashboard from "./pages/Dashboard/Dashboard";
import Relatorios from "./pages/Relatorios/Relatorios";

// --- Novos Estilos para a Barra de Navegação com Dropdown ---
const AppContainer = styled.div`
  font-family: "Segoe UI", sans-serif;
`;
const MainContent = styled.main`
  padding: 2rem;
`;

const NavBar = styled.nav`
  background-color: #2c3e50;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Estilo para o submenu (dropdown)
const SubNavList = styled.ul`
  display: none; /* Escondido por padrão */
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #34495e;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 5px 5px;
  z-index: 1000;
`;

// Item do menu principal
const NavItem = styled.li`
  position: relative; /* Necessário para o posicionamento do submenu */
  &:hover > ${SubNavList} {
    display: block; /* Mostra o submenu no hover */
  }
`;

// Estilo para os links (tanto principal quanto do submenu)
const StyledNavLink = styled(NavLink)`
  color: #ecf0f1;
  padding: 20px 25px;
  text-decoration: none;
  font-weight: bold;
  display: block;
  transition: background-color 0.3s;
  white-space: nowrap;

  &.active {
    background-color: #3498db;
    color: white;
  }

  &:hover {
    background-color: #4a6fa5;
  }
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <NavBar>
          <NavList>
            {/* 1. Menu Início (Dashboard) */}
            <NavItem>
              <StyledNavLink to="/">Início</StyledNavLink>
            </NavItem>

            {/* 2. Menu Cadastros (com submenu) */}
            <NavItem>
              <StyledNavLink to="#">Cadastros</StyledNavLink>{" "}
              {/* Link "morto" para o item principal */}
              <SubNavList>
                <li>
                  <StyledNavLink to="/competicoes">Competições</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/provas">Provas</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/equipes">Equipes</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/atletas">Atletas</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/localizacao">Localizações</StyledNavLink>
                </li>
              </SubNavList>
            </NavItem>

            {/* 3. Menu Inscrições e Vínculos */}
            <NavItem>
              <StyledNavLink to="#">Inscrições</StyledNavLink>
              <SubNavList>
                <li>
                  <StyledNavLink to="/inscricoes">
                    Inscrever em Provas
                  </StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/vinculos">
                    Vincular Atleta-Equipe
                  </StyledNavLink>
                </li>
              </SubNavList>
            </NavItem>

            {/* 4. Menu Resultados (com submenu) */}
            <NavItem>
              <StyledNavLink to="#">Resultados</StyledNavLink>
              <SubNavList>
                {/* Futuramente a tela de "Lançar Resultados" virá para cá */}
                <li>
                  <StyledNavLink to="/pontuacoes">
                    Lançar Pontuações
                  </StyledNavLink>
                </li>
              </SubNavList>
            </NavItem>

            {/* 5. Menu Relatórios */}
            <NavItem>
              <StyledNavLink to="/relatorios">Relatórios</StyledNavLink>
            </NavItem>
          </NavList>
        </NavBar>

        <MainContent>
          <Routes>
            {/* Adicionando a rota para a nova página inicial */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/relatorios" element={<Relatorios />} />
            {/* Rotas existentes */}
            <Route path="/competicoes" element={<Competicoes />} />
            <Route
              path="/competicao/:id/detalhes"
              element={<CompeticaoDetalhes />}
            />
            <Route path="/provas" element={<Provas />} />
            <Route path="/equipes" element={<Equipes />} />
            <Route path="/atletas" element={<Atletas />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route path="/inscricoes" element={<GerenciarInscricoes />} />
            <Route
              path="/inscricoes/:competicaoId"
              element={<GerenciarInscricoes />}
            />
            <Route path="/vinculos" element={<VinculoAtletaEquipe />} />{" "}
            {/* Renomeei a rota para clareza */}
            <Route path="/pontuacoes" element={<Pontuacoes />} />
            {/* Adicione aqui rotas para as futuras telas de Configurações e Classificações */}
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
