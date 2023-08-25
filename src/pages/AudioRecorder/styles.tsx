import styled from "styled-components";

export const RecordButton = styled.button`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 50%;
  border: 0.5 solid black;
  outline: 10px;
  cursor: pointer;
`;

export const StageWrapper = styled.div`
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  z-index: 100;
`;

export const ExplainStage = styled.h1`
  margin: 0;
`;
