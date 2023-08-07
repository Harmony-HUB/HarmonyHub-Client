import styled from "styled-components";
import THEME_COLORS from "./config/themeColors";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${THEME_COLORS.CONTAINER_COLOR};
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: ${THEME_COLORS.TITLE_COLOR};
  margin-bottom: 1rem;
`;

export const MyMusicButton = styled.div`
  position: absolute;
  bottom: 0;
  top: 80px;
  right: 5%;
`;

export const GuideDesktop = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
