import styled from "styled-components";

interface StyledButtonProps {
  backgroundColor?: string;
  margin?: string;
  border?: string;
  style?: string;
  fontSize?: string;
  hoverBackgroundColor?: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  border: balck;
  border-radius: 4px;
  padding: 0.5em 1em;
  font-size: ${props => props.fontSize};
  cursor: pointer;
  margin: ${({ margin }) => margin};
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  border: ${({ border }) => border};
  ${({ style }) => style}
  &:hover {
    background-color: ${props => props.hoverBackgroundColor};
  }
`;

export default StyledButton;
