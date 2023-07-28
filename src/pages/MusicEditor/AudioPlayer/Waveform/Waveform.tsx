import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "../Progressbar";
import WaveSelection from "../Selection";
import {
  setProgressPosition,
  setPausedTime,
  setAudioSource,
} from "../../../../feature/audioPlayerSlice";
import WaveformContainer from "./styles";
import { RootState } from "../../../../store";
import { setIsPlaying } from "../../../../feature/audioStatusSlice";

interface WaveformProps {
  audioPlayedId: number;
}

function Waveform({ audioPlayedId }: WaveformProps): React.ReactElement {
  const WAVE_COLOR = "#b3ecec";
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  const dispatch = useDispatch();

  const { audioSource, audioBuffer, selectedStart, selectedEnd } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const { isTrimmed, isPlaying } = useSelector(
    (state: RootState) => state.audioStatus.instances[audioPlayedId] || {}
  );

  const handleWaveformClick = (event: React.MouseEvent) => {
    const canvas = waveformCanvasRef.current;

    if (canvas) {
      const { width } = canvas;
      const clickX = event.nativeEvent.offsetX;
      const progressPercentage = (clickX / width) * 100;

      if (isPlaying) {
        if (!audioSource) return;

        dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

        audioSource.stop();
      }

      if (!audioBuffer) return;

      const newPausedTime = (progressPercentage / 100) * audioBuffer.duration;

      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
      dispatch(setAudioSource({ audioPlayedId, audioSource: null }));
      dispatch(
        setProgressPosition({
          audioPlayedId,
          progressPosition: progressPercentage,
        })
      );
    }
  };

  const drawWaveform = () => {
    if (!audioBuffer) return;

    const canvas = waveformCanvasRef.current;

    if (!canvas) return;

    const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    const { width, height } = canvas;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amplitude = height / 2;

    let maxAmplitude = 0;

    for (let i = 0; i < data.length; i += 1) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(data[i]));
    }

    const scaleFactor = maxAmplitude > 1 ? 1 / maxAmplitude : 1;

    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amplitude);
    ctx.strokeStyle = WAVE_COLOR;

    for (let i = 0; i < width; i += 1) {
      const sliceData = data.slice(i * step, (i + 1) * step);

      if (sliceData.length > 0) {
        const min = sliceData.reduce((a, b) => Math.min(a, b));
        const max = sliceData.reduce((a, b) => Math.max(a, b));
        const x = i / width;

        if (isTrimmed) {
          if (x >= selectedStart && x <= selectedEnd) {
            ctx.lineTo(i, (1 + min * scaleFactor) * amplitude);
            ctx.lineTo(i, (1 + max * scaleFactor) * amplitude);
          }
        } else {
          ctx.lineTo(i, (1 + min * scaleFactor) * amplitude);
          ctx.lineTo(i, (1 + max * scaleFactor) * amplitude);
        }
      }
    }

    ctx.lineTo(width, amplitude);
    ctx.stroke();
  };

  useEffect(() => {
    drawWaveform();
  }, [audioBuffer]);

  return (
    <WaveformContainer
      data-testid="waveform"
      onClick={e => handleWaveformClick(e)}
    >
      <canvas
        ref={waveformCanvasRef}
        width="1350"
        height="90"
        className="waveform-canvas"
      />
      <ProgressBar audioPlayedId={audioPlayedId} />
      <WaveSelection audioPlayedId={audioPlayedId} />
    </WaveformContainer>
  );
}

export default Waveform;
