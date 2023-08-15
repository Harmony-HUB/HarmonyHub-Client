import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProgressPosition } from "../../../feature/audioPlayerSlice";
import { ProgressBarContainer, ProgressTime } from "./styles";
import { PropsId } from "../../../types";
import { RootState } from "../../../store";

function ProgressBar({ audioPlayedId }: PropsId): React.ReactElement {
  const progressCanvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  const { audioBuffer, progressPosition, startTime, pausedTime, isPlaying } =
    useSelector(
      (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
    );

  const audioContext = useSelector(
    (state: RootState) => state.audioContext.audioContext
  );

  const updateProgress = () => {
    if (!audioContext || !audioBuffer || !isPlaying) return;

    const currentTime =
      audioContext.context.currentTime - startTime + pausedTime;
    const progress = (currentTime / audioBuffer.duration) * 100;

    dispatch(
      setProgressPosition({ audioPlayedId, progressPosition: progress })
    );
  };

  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      updateProgress();
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      loop();
    } else {
      updateProgress();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const duration = audioBuffer ? audioBuffer.duration : 0;
  const currentTime = (duration * progressPosition) / 100;

  const drawProgress = () => {
    const canvas = progressCanvasRef.current;

    if (!canvas) return;

    const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    const { width, height } = canvas;
    const x = (progressPosition * width) / 100;

    if (!ctx) return;

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
