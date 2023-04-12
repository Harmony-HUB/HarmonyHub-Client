import PropTypes from "prop-types";
import StyledButtonWrapper from "./styles";

function ButtonWrapper({ children, bottom, left, direction, margin }) {
  return (
    <StyledButtonWrapper
      bottom={bottom}
      left={left}
      direction={direction}
      margin={margin}
    >
      {children}
    </StyledButtonWrapper>
  );
}

ButtonWrapper.propTypes = {
  children: PropTypes.node,
  bottom: PropTypes.string,
  left: PropTypes.string,
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
};

ButtonWrapper.defaultProps = {
  children: null,
  bottom: null,
  left: null,
  direction: "horizontal",
};

export default ButtonWrapper;
