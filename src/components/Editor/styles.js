import styled from "styled-components";

export const Editor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 80%;
  height: 60%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

export const SelectFileButton = styled.label`
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  background: #3f51b5;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #536dfe;
  }
`;

export const FileInput = styled.input`
  display: none;
`;
