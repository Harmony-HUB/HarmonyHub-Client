import styled from "styled-components";

interface SongButtonProps {
  isSelected: boolean;
}

export const SongList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export const SongButton = styled.button<SongButtonProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  border: 1 solid black;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(355, 355, 355, 0.3)" : ""};
`;

export const SongTitle = styled.h3`
  margin: 0;
  font-size: 1em;
`;

export const SongCreationTime = styled.p`
  margin: 0;
  font-size: 0.8em;
  color: #aaa;
`;

export const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
