// src/components/Button.js
import styled from "styled-components";

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }

  &.delete {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }

  & + & {
    margin-left: 10px;
  }
`;
