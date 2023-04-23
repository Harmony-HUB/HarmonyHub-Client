import styled from "styled-components";

export const Editor = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: relative;
  width: 90%;
  height: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid #cccc;
  border-radius: 4px;
  resize: none;
  margin-top: 100px;
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

export const FileInputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldWrapper = styled.div`
  position: relative;
  border: ${props => (props.isSelected ? "2px solid #00aaff" : "none")};
  box-shadow: ${props =>
    props.isSelected ? "0 0 5px rgba(0, 170, 255, 0.5)" : "none"};
`;
