import { useEffect, useState } from "react";
import * as Tone from "tone";
import Waveform from "../Waveform/Waveform";
import { SliderContainer, SliderInput } from "./styles";
import Controls from "./control";

function AudioPlayer({ file }) {
  const [audioContext, setAudioContext] = useState({
    context: null,
    gainNode: null,
    pitchShifter: null,
  });
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [tempo, setTempo] = useState(1);

  useEffect(() => {
    const newAudioContext = new Tone.Context();
    const gainNode = new Tone.Gain(1).toDestination();

    const pitchShift = new Tone.PitchShift(0).connect(gainNode);

    setAudioContext({
      context: newAudioContext,
      gainNode,
      pitchShift,
    });
  }, []);

  const updateProgress = () => {
    if (!audioContext || !audioBuffer || !isPlaying) return;

    const currentTime =
      audioContext.context.currentTime - startTime + pausedTime;
    const progress = (currentTime / audioBuffer.duration) * 100;
    setProgressPosition(progress);
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        updateProgress();
      }, 10);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isPlaying, updateProgress]);

  const playSound = async () => {
    if (!audioContext || !audioContext.context || !audioBuffer || audioSource)
      return;

    if (audioContext.context.state === "suspended") {
      await audioContext.context.resume();
    }

    setIsPlaying(true);

    const newAudioSource = new Tone.GrainPlayer(audioBuffer, () => {
      setIsPlaying(false);
    });
    newAudioSource.connect(audioContext.pitchShift);
    audioContext.gainNode.connect(Tone.getContext().destination);
    newAudioSource.playbackRate = 1;
    newAudioSource.loop = false;
    newAudioSource.start(0, pausedTime);

    setAudioSource(newAudioSource);
    setStartTime(audioContext.context.currentTime);
  };

  const pauseSound = () => {
    if (!audioSource) return;

    setIsPlaying(false);

    audioSource.stop();
    setPausedTime(audioContext.context.currentTime - startTime + pausedTime);
    setAudioSource(null);
  };

  const stopSound = () => {
    if (!audioSource) return;

    setIsPlaying(false);

    audioSource.stop();
    setAudioSource(null);
    setPausedTime(0);

    setProgressPosition(0);
  };

  const handleVolumeChange = event => {
    const newVolume = event.target.value;
    setVolume(newVolume);

    if (audioContext && audioContext.gainNode) {
      audioContext.gainNode.gain.value = newVolume;
    }
  };

  const handlePitchChange = delta => {
    const newPitch = parseFloat(pitch + delta);
    if (newPitch < 0.5 || newPitch > 2) return;
    setPitch(newPitch);

    if (audioContext && audioContext.pitchShift) {
      audioContext.pitchShift.pitch = newPitch - 1;
    }
  };

  const handleTempoChange = delta => {
    const newTempo = parseFloat(tempo + delta);
    if (newTempo < 0.5 || newTempo > 2) return;
    setTempo(newTempo);

    if (audioSource) {
      audioSource.playbackRate = newTempo;
    }
  };

  return (
    <div>
      <Waveform
        file={file}
        onAudioBufferLoaded={setAudioBuffer}
        waveformColor="#b3ecec"
        progressPosition={progressPosition}
        volume={volume}
      />
      <SliderContainer>
        <SliderInput
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: "100%" }}
        />
      </SliderContainer>
      <Controls
        handlePitchChange={handlePitchChange}
        handleTempoChange={handleTempoChange}
        handleVolumeChange={handleVolumeChange}
        playSound={playSound}
        stopSound={stopSound}
        pauseSound={pauseSound}
      />
    </div>
  );
}

export default AudioPlayer;
