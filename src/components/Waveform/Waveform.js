import React, { useRef, useEffect, useState } from "react";
import "./Waveform.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice";

function Waveform({
  file,
  onAudioBufferLoaded,
  waveformColor = "#b3ecec",
  onSelectionChange,
}) {
  const waveformCanvasRef = useRef(null);
  const selectionCanvasRef = useRef(null);
  const progressCanvasRef = useRef(null);

  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [dragging, setDragging] = useState(null);

  const selectedStart = useSelector(state => state.audioPlayer.selectedStart);
  const selectedEnd = useSelector(state => state.audioPlayer.selectedEnd);
  const progressPosition = useSelector(
    state => state.audioPlayer.progressPosition
  );
  const volume = useSelector(state => state.audioPlayer.volume);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!file) return;

    const loadAudioFile = async () => {
      try {
        const response = await fetch(file);
        const audioData = await response.arrayBuffer();
        const newAudioBuffer = await audioContext.decodeAudioData(audioData);
        setAudioBuffer(newAudioBuffer);
        onAudioBufferLoaded(newAudioBuffer);
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
    const step = Math.ceil(data.length / width) / volume;
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
      ctx.lineTo(i, (1 + min * scaleFactor) * amplitude);
      ctx.lineTo(i, (1 + max * scaleFactor) * amplitude);
    }

    ctx.lineTo(width, amplitude);
    ctx.stroke();
  };

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

  const drawSelection = () => {
    const canvas = selectionCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const handleWidth = 4;
    const leftHandleX = selectedStart * width - handleWidth / 2;
    const rightHandleX = selectedEnd * width - handleWidth / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(leftHandleX, 0, handleWidth, height);
    ctx.fillRect(rightHandleX, 0, handleWidth, height);
  };

  const handleMouseDown = event => {
    const canvas = selectionCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const position = x / canvas.width;

    const startDistance = Math.abs(position - selectedStart);
    const endDistance = Math.abs(position - selectedEnd);

    if (startDistance < endDistance) {
      setDragging("start");
    } else {
      setDragging("end");
    }
  };

  const handleMouseMove = event => {
    if (!dragging) return;

    const canvas = selectionCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const position = x / canvas.width;

    if (dragging === "start") {
      dispatch(setSelectedStart(Math.min(Math.max(0, position), selectedEnd)));
    } else {
      dispatch(setSelectedEnd(Math.max(Math.min(1, position), selectedStart)));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    drawWaveform();
  }, [audioBuffer, volume]);

  useEffect(() => {
    drawSelection();
  }, [selectedEnd, selectedStart]);

  useEffect(() => {
    let animationFrameId;

    const animateProgress = () => {
      drawProgress();
      animationFrameId = requestAnimationFrame(animateProgress);
    };

    animateProgress();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [progressPosition]);

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
      />
      <canvas
        ref={progressCanvasRef}
        width="1350"
        height="100"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <canvas
        ref={selectionCanvasRef}
        width="1350"
        height="100"
        style={{ position: "absolute", top: 0, left: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

export default Waveform;
