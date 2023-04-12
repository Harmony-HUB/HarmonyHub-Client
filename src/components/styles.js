import styled from "styled-components";

export const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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
