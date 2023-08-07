import { ReactNode, MouseEvent } from "react";
import StyledButton from "./styles";
import THEME_COLORS from "../../../config/themeColors";

interface ButtonProps {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  backgroundColor?: string;
  disabled?: boolean;
  color?: string;
  fontSize?: string;
  hoverBackgroundColor?: string;
  margin?: string;
  border?: string;
}

function Button({
  children,
  onClick,
  backgroundColor,
  color,
  fontSize,
  hoverBackgroundColor,
  margin,
  border,
  disabled,
}: ButtonProps) {
  return (
    <StyledButton
      onClick={onClick}
      backgroundColor={backgroundColor}
      color={color}
      fontSize={fontSize}
      hoverBackgroundColor={hoverBackgroundColor}
      margin={margin}
      border={border}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
}

Button.defaultProps = {
  children: null,
  onClick: null,
  backgroundColor: `${THEME_COLORS.WHITE}`,
  color: `${THEME_COLORS.AQUA}`,
  fontSize: "1rem",
  hoverBackgroundColor: `${THEME_COLORS.HOVERD_AQUA}`,
  margin: "0.5rem 0",
  border: `${THEME_COLORS.AQUA}`,
  disabled: false,
};

export default Button;
