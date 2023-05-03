import styled from "styled-components";

export const VolumeSliderContainer = styled.div`
  position: absolute;
  width: 100px;
  height: 0;
  overflow: hidden;
  transition: height 0.2s ease-in-out;
`;

export const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s linear;
  &:hover {
    opacity: 1;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
`;

export const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  &:hover ${() => SliderInput} {
    visibility: visible;
    opacity: 1;
  }
  &:hover ${() => VolumeSliderContainer} {
    height: 100px;
  }
`;

export const AudioPlayerWrapper = styled.div`
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === "vertical" ? "column" : "row"};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const VerticalSliderWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  @media (max-width: 768px) {
    position: static;
    align-items: center;
  }
`;

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

export const VolumeIconContainer = styled.div`
  position: relative;
  cursor: pointer;
`;
