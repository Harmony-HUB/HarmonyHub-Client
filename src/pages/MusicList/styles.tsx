import styled from "styled-components";
import THEME_COLORS from "../../config/themeColors";

interface MusicButtonProps {
  isSelected: boolean;
}

export const MusicLists = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export const MusicButton = styled.button<MusicButtonProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  border: 1 solid black;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(355, 355, 355, 0.3)" : null};
`;

export const MusicTitle = styled.h3`
  margin: 0;
  font-size: 1em;
`;

export const MusicCreationTime = styled.p`
  margin: 0;
  font-size: 0.8em;
  color: ${THEME_COLORS.MUSIC_CREATION_TIME};
`;

export const MusicInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
