import styled from "styled-components";

export const AudioPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

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

export const StyledVolumeSlider = styled.input.attrs({
  type: "range",
  min: "0",
  max: "1",
  step: "0.01",
})`
  display: inline-block;
  opacity: 1;
  width: 100px;
  vertical-align: middle;
  transition: opacity 0.3s, margin-left 0.1s;

  &:hover {
    opacity: 1;
    margin-left: 10px;
  }
`;
