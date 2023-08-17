import styled from "styled-components";
import THEME_COLORS from "../../../config/themeColors";

type ButtonProps = {
  width?: string;
  height?: string;
  margin?: string;
  paddig?: string;
  backgroundColor?: string;
};

const Button = styled.button<ButtonProps>`
  cursor: pointer;
  width: ${props => props.width || "50px"};
  height: ${props => props.height || "50px"};
  font-size: 18px;
  font-weight: 750;
  z-index: 100;
  border: 2px solid ${THEME_COLORS.AQUA};
  border-radius: 15px;
  color: ${THEME_COLORS.AQUA};
  margin: ${props => props.margin || "10px"};
  background-color: ${props => props.backgroundColor || "transparent"};

  &:hover {
    background-color: ${THEME_COLORS.AQUA};
    color: ${THEME_COLORS.WHITE};
  }
`;

export default Button;
