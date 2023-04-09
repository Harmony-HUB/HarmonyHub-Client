import styled from "styled-components";
import PropTypes from "prop-types";

const StyledButtonWrapper = styled.div`
  position: absolute;
  bottom: ${props => props.bottom || "1rem"};
  left: ${props => props.left || "1rem"};
  display: flex;
  flex-direction: ${props =>
    props.direction === "vertical" ? "column" : "row"};
  align-items: center;
`;

function ButtonWrapper({ children, bottom, left, direction }) {
  return (
    <StyledButtonWrapper bottom={bottom} left={left} direction={direction}>
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
