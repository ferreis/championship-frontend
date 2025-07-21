import styled from "styled-components";

export const ManagerContainer = styled.div`
  padding: 20px;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-end;

  input,
  .select-container {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
    min-width: 200px;
  }

  .select-container {
    border: none;
    padding: 0;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  td.actions {
    display: flex;
    gap: 10px;
  }
`;

export const Button = styled.button`
  padding: 9px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

// ### ESTILOS DE PAGINAÇÃO ADICIONADOS AQUI ###
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
`;

export const PageControls = styled.div`
  display: flex;
  align-items: center;
`;

export const PageButton = styled.button`
  margin: 0 4px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? "#007bff" : "#ddd")};
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#007bff" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:not(:disabled):hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
  }
`;

export const ItemsPerPageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;

  select {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ced4da;
  }
`;
