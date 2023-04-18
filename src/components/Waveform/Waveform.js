import React, { useRef, useEffect, useState } from "react";
import "./Waveform.css";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "../Progressbar";
import WaveSelection from "../Selection";
import {
  setProgressPosition,
  setAudioBuffer,
} from "../../feature/audioPlayerSlice";

function Waveform({
  file,
  waveformColor = "#b3ecec",
  onSelectionChange,
  onWaveformClick,
  audioBuffer,
  isTrimmed,
}) {
  const waveformCanvasRef = useRef(null);

  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );

  const dispatch = useDispatch();

  const reduxAudioBuffer = useSelector(state => state.audioPlayer.audioBuffer);
  const bufferToUse = audioBuffer || reduxAudioBuffer;

  const selectedStart = useSelector(state => state.audioPlayer.selectedStart);
  const selectedEnd = useSelector(state => state.audioPlayer.selectedEnd);
  const progressPosition = useSelector(
    state => state.audioPlayer.progressPosition
  );
  const volume = useSelector(state => state.audioPlayer.volume);

  const duration = audioBuffer ? audioBuffer.duration : 0;

  const handleWaveformClick = event => {
    const canvas = waveformCanvasRef.current;
    const { width } = canvas;
    const clickX = event.nativeEvent.offsetX;
    const progressPercentage = (clickX / width) * 100;
    onWaveformClick(progressPercentage);

    dispatch(setProgressPosition(progressPercentage));
  };

  useEffect(() => {
    if (!file) return;

    const loadAudioFile = async () => {
      try {
        const response = await fetch(file);
        const audioData = await response.arrayBuffer();
        const newAudioBuffer = await audioContext.decodeAudioData(audioData);
        dispatch(setAudioBuffer(newAudioBuffer));
      } catch (error) {
        console.error(error);
      }
    };

    loadAudioFile();
  }, [file]);

  const drawWaveform = () => {
    if (!audioBuffer) return;

    const canvas = waveformCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amplitude = height / 2;

    let maxAmplitude = 0;
    for (let i = 0; i < data.length; i += 1) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(data[i]));
    }
    const scaleFactor = maxAmplitude > 1 ? 1 / maxAmplitude : 1;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amplitude);
    ctx.strokeStyle = waveformColor;

    for (let i = 0; i < width; i += 1) {
      const min = Math.min.apply(null, data.slice(i * step, (i + 1) * step));
      const max = Math.max.apply(null, data.slice(i * step, (i + 1) * step));
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

    ctx.lineTo(width, amplitude);
    ctx.stroke();
  };

  useEffect(() => {
    drawWaveform();
  }, [audioBuffer, volume, bufferToUse]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedStart, selectedEnd);
    }
  }, [selectedStart, selectedEnd]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={waveformCanvasRef}
        width="1350"
        height="100"
        className="waveform-canvas"
        onClick={handleWaveformClick}
      />
      <ProgressBar progressPosition={progressPosition} duration={duration} />
      <WaveSelection
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}

export default Waveform;
