import styled from "styled-components";
import THEME_COLORS from "../../../../../config/themeColors";

interface SliderProps {
  showSlider: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledVolumeSlider = styled.input.attrs({
  type: "range",
  min: "0",
  max: "1",
  step: "0.01",
})<SliderProps>`
  width: 150px;
  opacity: 0;
  position: absolute;
  left: 50px;
  z-index: 2;
  transition: opacity 0.3s;

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export const VolumeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: ${THEME_COLORS.AQUA};

  &:hover ${StyledVolumeSlider} {
    opacity: 1;
  }
`;

export default StyledVolumeSlider;
