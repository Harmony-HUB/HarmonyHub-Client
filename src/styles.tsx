import styled, { createGlobalStyle } from "styled-components";
import THEME_COLORS from "./config/themeColors";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${THEME_COLORS.CONTAINER_COLOR};
  overflow-y: hidden;
  z-index: 1;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  color: ${THEME_COLORS.TITLE_COLOR};
  margin-bottom: 1rem;
`;

export const MyMusicButton = styled.div`
  position: absolute;
  bottom: 0;
  top: 50px;
  right: 5%;
`;

export const GuideDesktop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
