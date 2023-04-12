import styled from "styled-components";

const StyledButtonWrapper = styled.div`
  position: absolute;
  bottom: ${props => props.bottom || "1rem"};
  left: ${props => props.left || "1rem"};
  gap: 25px;
  display: flex;
  flex-direction: ${props =>
    props.direction === "vertical" ? "column" : "row"};
  align-items: center;
`;

export default StyledButtonWrapper;
