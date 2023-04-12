import React, { useRef, useEffect, useState } from "react";
import "./Waveform.css";

function Waveform({
  file,
  onAudioBufferLoaded,
  waveformColor = "#b3ecec",
  progressPosition,
  volume,
}) {
  const waveformCanvasRef = useRef(null);
  const progressCanvasRef = useRef(null);

  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const [audioBuffer, setAudioBuffer] = useState(null);

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

  const drawProgress = () => {
    const canvas = progressCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const x = (progressPosition * width) / 100;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawWaveform = () => {
    if (!audioBuffer) return;

    const canvas = waveformCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amplitude = (height / 2) * volume;

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

  useEffect(() => {
    drawWaveform();
  }, [audioBuffer, volume]);

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
    </div>
  );
}

export default Waveform;
