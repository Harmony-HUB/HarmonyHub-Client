import React, { useRef, useEffect, useState } from "react";

function Waveform({ file, onAudioBufferLoaded }) {
  const canvasRef = useRef(null);
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
  }, [file, audioContext, onAudioBufferLoaded]);

  const drawWaveform = () => {
    if (!audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width } = canvas;
    const { height } = canvas;

    const data = audioBuffer.getChannelData(0);
    console.log("data: ", data);
    const step = Math.ceil(data.length / width);
    console.log("step: ", step);
    const amplitude = height / 2;

    let maxAmplitude = 0;
    for (let i = 0; i < data.length; i += 1) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(data[i]));
    }
    const scaleFactor = maxAmplitude > 1 ? 1 / maxAmplitude : 1;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amplitude);

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
  }, [audioBuffer]);

  return (
    <div>
      <canvas ref={canvasRef} width="1350" height="100" />
    </div>
  );
}

export default Waveform;