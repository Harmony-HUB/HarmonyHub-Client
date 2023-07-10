/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "../AudioPlayer/Progressbar";
import WaveSelection from "../AudioPlayer/Selection";
import {
  setProgressPosition,
  setAudioBuffer,
} from "../../feature/audioPlayerSlice";

function Waveform({
  file,
  onWaveformClick,
  isTrimmed,
  audioPlayedId,
  recording,
}) {
  const waveformColor = "#b3ecec";
  const waveformCanvasRef = useRef(null);

  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );

  const dispatch = useDispatch();

  const { audioBuffer, selectedStart, selectedEnd } = useSelector(
    state => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const handleWaveformClick = event => {
    if (!onWaveformClick) return;

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
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
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
    <div
      data-testid="waveform"
      style={{ position: "relative" }}
      onClick={handleWaveformClick}
      onKeyDown={handleWaveformClick}
    >
      <canvas
        ref={waveformCanvasRef}
        width="1350"
        height="90"
        className="waveform-canvas"
      />
      {recording ? null : <ProgressBar audioPlayedId={audioPlayedId} />}
      {recording ? null : <WaveSelection audioPlayedId={audioPlayedId} />}
    </div>
  );
}

export default Waveform;
