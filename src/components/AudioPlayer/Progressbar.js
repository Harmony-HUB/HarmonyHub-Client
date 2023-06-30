import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ProgressBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ProgressTime = styled.div`
  position: absolute;
  bottom: 100;
  left: ${props => props.progressPosition}%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
  white-space: nowrap;
`;

function ProgressBar({ audioPlayedId }) {
  const progressCanvasRef = useRef(null);

  const { audioBuffer, progressPosition } = useSelector(
    state => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const duration = audioBuffer ? audioBuffer.duration : 0;
  const currentTime = (duration * progressPosition) / 100;

  const drawProgress = () => {
    const canvas = progressCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const x = (progressPosition * width) / 100;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    drawProgress();
  }, [progressPosition]);

  return (
    <ProgressBarContainer>
      <canvas ref={progressCanvasRef} width="1350" height="100" />
      <ProgressTime progressPosition={progressPosition}>
        {currentTime.toFixed(2)} s
      </ProgressTime>
    </ProgressBarContainer>
  );
}

export default ProgressBar;
