import styled from "styled-components";

const WaveformCanvas = styled.div`
  display: block;
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 70px;
  }
`;

export default WaveformCanvas;
