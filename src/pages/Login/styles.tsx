import styled from "styled-components";
import Lottie from "lottie-react";
import THEME_COLORS from "../../config/themeColors";

export const NotesLottie = styled(Lottie)`
  width: 100px;
  height: 100px;
  position: absolute;
  right: 40%;
  top: 40%;
  transform: translateX(60%);
  transform: translateY(-40%);
`;

export const Cat = styled.div`
  width: 300px;
  height: 300px;
  background-image: url("/cat.png");
  background-size: cover;
`;

export const Notes = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: url("/notes.png");
  background-size: 240px;
  background-position: center;
  opacity: 0.03;
`;

export const LoginContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

export const LoginButton = styled.button`
  cursor: pointer;
  width: 100px;
  height: 50px;
  font-size: 18px;
  font-weight: 750;
  z-index: 100;
  border: 2px solid ${THEME_COLORS.AQUA};
  border-radius: 15px;
  color: ${THEME_COLORS.AQUA};
  margin: 20px;
  margin-bottom: 50px;
  background-color: transparent;

  &:hover {
    background-color: ${THEME_COLORS.AQUA};
    color: ${THEME_COLORS.WHITE};
  }
`;
