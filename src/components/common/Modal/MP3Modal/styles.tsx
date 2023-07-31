import styled from "styled-components";

export const ModalBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: #1f1f1f;
  border-radius: 20px;
  width: 300px;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  color: #fff;
  border: none;
  cursor: default;
`;

export const ContentArea = styled.div`
  background-color: #000;
  border-radius: 10px;
  width: 300px;
  height: 200px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  cursor: pointer;
`;

export const PlayButtonWrapper = styled.div`
  border-radius: 50%;
  width: 60%;
  height: 40%;
  background-color: #4d4d4d;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const PlayButtonInner = styled.div`
  border-radius: 50%;
  width: 50%;
  height: 50%;
  background-color: #bfbfbf;
`;
