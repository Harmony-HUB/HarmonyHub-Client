import styled, { keyframes } from "styled-components";

const SpinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #333;
  animation: ${SpinnerAnimation} 0.8s linear infinite;
`;

function Spinner() {
  return <StyledSpinner />;
}

export default Spinner;
