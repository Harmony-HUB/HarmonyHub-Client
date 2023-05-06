import styled from "styled-components";

export const Editor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 90%;
  height: 80%;
  max-height: calc(100vh - 100px - 50px);
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 1px solid #cccc;
  border-radius: 4px;
  overflow-y: auto;
  margin-top: 100px;

  @media (max-width: 768px) {
    margin-top: 50px;
  }
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

export const FileUploadContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export const FieldWrapper = styled.div`
  position: relative;
  border: ${props => (props.isSelected ? "2px solid #00aaff" : "none")};
  box-shadow: ${props =>
    props.isSelected ? "0 0 5px rgba(0, 170, 255, 0.5)" : "none"};
`;

export const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;
