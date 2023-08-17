import styled from "styled-components";
import THEME_COLORS from "../../../config/themeColors";

interface ProgressTimeProps {
  progressPosition: number;
}

export const AudioPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${THEME_COLORS.WHITE};
  padding: 20px;
  border-radius: 10px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`;

export const ProgressBarContainer = styled.div`
  position: absolute;
  top: 0px;
`;

export const ProgressTime = styled.div<ProgressTimeProps>`
  position: absolute;
  bottom: 100;
  left: ${props => props.progressPosition}%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
  white-space: nowrap;
`;

export const SelectionHandle = styled.div`
  position: absolute;
  top: -10px;
  width: 10px;
  height: 120px;
  cursor: col-resize;
  z-index: 1px;
  background-color: ${THEME_COLORS.SELECT_HANDLE};
  border: 1px solid white;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const SelectionHandleLeft = styled(SelectionHandle)`
  left: -5px;
`;

export const SelectionHandleRight = styled(SelectionHandle)`
  right: -5px;
`;

export const AudioControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonWidthContainer = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;
