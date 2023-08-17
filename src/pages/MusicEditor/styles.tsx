import styled from "styled-components";
import THEME_COLORS from "../../config/themeColors";

type BottomBarProps = {
  isBottomBar: boolean;
};

export const Editor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 90%;
  height: 80%;
  max-height: calc(100vh - 100px - 50px);
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 1px solid ${THEME_COLORS.EDITOR_BORDER};
  border-radius: 4px;
  overflow-y: auto;
  margin-top: 100px;

  @media (max-width: 768px) {
    margin-top: 50px;
  }
`;

export const CenteredContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 70px;
  height: 80%;
`;

export const SelectFileButton = styled.label`
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  background: ${THEME_COLORS.SELECT_FILE_BUTTON};
  color: ${THEME_COLORS.WHITE};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${THEME_COLORS.SELECT_FILE_BUTTON_HOVER};
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileInputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FileUploadContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export const BottomBar = styled.div<BottomBarProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  height: 40px;

  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  padding-left: 70px;
  padding-right: 70px;
  border: 1px solid ${THEME_COLORS.BOTTOM_BORDER};
  background-color: ${THEME_COLORS.BOTTOM};
  transform: translateY(${props => (props.isBottomBar ? "0%" : "100%")});
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

export const BottomBarHandle = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 40px;
  z-index: 5;
  background-color: ${THEME_COLORS.BOTTOM};
  border-radius: 20%;
  position: absolute;
  right: 100px;
  bottom: 50px;
`;

export const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 15px;

  &.move-up,
  &.move-down {
    transition: transform 0.3s ease;
  }

  &.move-up {
    transform: translateY(-100%);
  }

  &.move-down {
    transform: translateY(100%);
  }
`;

export const MoveButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
