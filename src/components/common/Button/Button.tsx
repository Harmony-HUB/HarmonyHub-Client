import { ReactNode, MouseEvent } from "react";
import PropTypes from "prop-types";
import StyledButton from "./styles";

interface ButtonProps {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  backgroundColor?: string;
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
    >
      {children}
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  margin: PropTypes.string,
  border: PropTypes.string,
};

Button.defaultProps = {
  children: null,
  onClick: null,
  backgroundColor: "#fff",
  color: "#3bd6c6",
  fontSize: "1rem",
  hoverBackgroundColor: "#2bc5b4",
  margin: "0.5rem 0",
  border: "#3bd6c6",
};

export default Button;
