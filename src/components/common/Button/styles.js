import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  border: balck;
  border-radius: 4px;
  padding: 0.5em 1em;
  font-size: ${props => props.fontSize};
  cursor: pointer;
  margin: ${props => props.margin};
  ${({ style }) => style}
  &:hover {
    background-color: ${props => props.hoverBackgroundColor};
  }
`;

export default StyledButton;
