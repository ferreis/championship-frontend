import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./styles/globalStyles"; // 1. Importa os estilos globais

// 2. Localiza o elemento 'root' no seu arquivo public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// 3. Renderiza a aplicação
root.render(
  <React.StrictMode>
    {/* O <React.StrictMode> é uma ferramenta para destacar problemas potenciais na aplicação.
      Não afeta a build de produção.
    */}

    {/* <GlobalStyle /> injeta os estilos definidos no arquivo globalStyles.js 
      em toda a sua aplicação, garantindo uma aparência consistente.
    */}
    <GlobalStyle />

    {/* <App /> é o seu componente principal que contém toda a lógica
      de navegação e a estrutura das páginas.
    */}
    <App />
  </React.StrictMode>
);
