import styled from "styled-components";
import THEME_COLORS from "../../config/themeColors";

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

export const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: ${THEME_COLORS.BOTTOM};
  border-top: 1px solid ${THEME_COLORS.BOTTOM_BORDER};

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

export const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 15px;
`;

export const MoveButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
