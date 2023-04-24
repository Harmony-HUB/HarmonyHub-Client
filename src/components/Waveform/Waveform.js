import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import WaveformCanvas from "./styles";
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
  isTrimmed,
  audioPlayedId,
  isDragging,
  drag,
}) {
  const waveformCanvasRef = useRef(null);

  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const [selectionActive, setSelectionActive] = useState(false);

  const dispatch = useDispatch();

  const { audioBuffer, progressPosition, selectedStart, selectedEnd } =
    useSelector(state => state.audioPlayer.instances[audioPlayedId] || {});

  const reduxAudioBuffer = useSelector(state => state.audioPlayer.audioBuffer);
  const bufferToUse = audioBuffer || reduxAudioBuffer;

  const duration = audioBuffer ? audioBuffer.duration : 0;

  const handleWaveformClick = event => {
    const canvas = waveformCanvasRef.current;
    const { width } = canvas;
    const clickX = event.nativeEvent.offsetX;
    const progressPercentage = (clickX / width) * 100;
    onWaveformClick(progressPercentage);

    dispatch(
      setProgressPosition({
        audioPlayedId,
        progressPosition: progressPercentage,
      })
    );
  };

  useEffect(() => {
    if (!file) return;

    const loadAudioFile = async () => {
      try {
        const response = await fetch(file);
        const audioData = await response.arrayBuffer();
        const newAudioBuffer = await audioContext.decodeAudioData(audioData);
        dispatch(
          setAudioBuffer({ audioPlayedId, audioBuffer: newAudioBuffer })
        );
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
  }, [audioBuffer, bufferToUse]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedStart, selectedEnd);
    }
  }, [selectedStart, selectedEnd]);

  return (
    <div style={{ position: "relative" }}>
      <div
        className="waveform-drag-handle"
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          pointerEvents: selectionActive ? "none" : "auto",
        }}
      />
      <canvas
        ref={waveformCanvasRef}
        width="1350"
        height="90"
        className="waveform-canvas"
        onClick={handleWaveformClick}
        style={{
          pointerEvents: selectionActive ? "none" : "auto",
        }}
      />
      <ProgressBar progressPosition={progressPosition} duration={duration} />
      <WaveSelection
        audioPlayedId={audioPlayedId}
        onSelectionChange={onSelectionChange}
        selectionActive={selectionActive}
        setSelectionActive={setSelectionActive}
      />
    </div>
  );
}

export default Waveform;
