import PropTypes from "prop-types";
import StyledButton from "./styles";

function Button({
  children,
  onClick,
  backgroundColor,
  color,
  fontSize,
  hoverBackgroundColor,
  margin,
}) {
  return (
    <StyledButton
      onClick={onClick}
      backgroundColor={backgroundColor}
      color={color}
      fontSize={fontSize}
      hoverBackgroundColor={hoverBackgroundColor}
      margin={margin}
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
};

Button.defaultProps = {
  children: null,
  onClick: null,
  backgroundColor: "#3bd6c6",
  color: "#fff",
  fontSize: "1rem",
  hoverBackgroundColor: "#2bc5b4",
  margin: "0.5rem 0",
};

export default Button;
