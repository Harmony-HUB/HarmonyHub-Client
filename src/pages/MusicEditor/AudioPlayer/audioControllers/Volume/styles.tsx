import styled from "styled-components";

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
  display: inline-block;
  opacity: 1;
  width: 100px;
  vertical-align: middle;
  transition:
    opacity 0.3s,
    margin-left 0.1s;
  visibility: ${props => (props.showSlider ? "visible" : "hidden")};

  &:hover {
    opacity: 1;
    margin-left: 10px;
  }
`;

export default StyledVolumeSlider;
