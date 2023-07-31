import styled from "styled-components";

interface ProgressTimeProps {
  progressPosition: number;
}

export const AudioPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);

  @media (max-width: 768px) {
    padding: 10px;
  }
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
  background-color: #6bb9f0;
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
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
