import styled from "styled-components";
import THEME_COLORS from "../../../../config/themeColors";

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
  z-index: 200;
`;

export const ModalContent = styled.div`
  background-color: ${THEME_COLORS.MP3_WRAPPER};
  border-radius: 20px;
  width: 300px;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  color: ${THEME_COLORS.WHITE};
  border: none;
  cursor: default;
`;

export const ContentArea = styled.div`
  background-color: ${THEME_COLORS.BLACK};
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
  background-color: ${THEME_COLORS.MP3_BUTTON_WRAPPER};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const PlayButtonInner = styled.div`
  border-radius: 50%;
  width: 50%;
  height: 50%;
  background-color: ${THEME_COLORS.MP3_BUTTON_INNER};
`;
