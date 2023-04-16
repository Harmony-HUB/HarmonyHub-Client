import { useEffect, useState } from "react";
import * as Tone from "tone";
import { useSelector, useDispatch } from "react-redux";
import Waveform from "../Waveform/Waveform";
import { SliderContainer, SliderInput } from "./styles";
import Controls from "./control";
import Button from "../common/Button/Button";
import {
  setStartTime,
  setPausedTime,
  setProgressPosition,
  setIsPlaying,
  setVolume,
  setPitch,
  setTempo,
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice";

function AudioPlayer({ file }) {
  const [audioContext, setAudioContext] = useState({
    context: null,
    gainNode: null,
    pitchShift: null,
  });
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioSource, setAudioSource] = useState(null);

  const startTime = useSelector(state => state.audioPlayer.startTime);
  const pausedTime = useSelector(state => state.audioPlayer.pausedTime);
  const isPlaying = useSelector(state => state.audioPlayer.isPlaying);
  const volume = useSelector(state => state.audioPlayer.volume);
  const pitch = useSelector(state => state.audioPlayer.pitch);
  const tempo = useSelector(state => state.audioPlayer.tempo);
  const selectedStart = useSelector(state => state.audioPlayer.selectedStart);
  const selectedEnd = useSelector(state => state.audioPlayer.selectedEnd);

  const dispatch = useDispatch();

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
    dispatch(setProgressPosition(progress));
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

    dispatch(setIsPlaying(true));

    const newAudioSource = new Tone.GrainPlayer(audioBuffer, () => {
      dispatch(setIsPlaying(false));
    });
    newAudioSource.connect(audioContext.pitchShift);
    audioContext.gainNode.connect(Tone.getContext().destination);
    newAudioSource.playbackRate = 1;
    newAudioSource.loop = false;

    const playbackOffset =
      pausedTime > 0 ? pausedTime : selectedStart * audioBuffer.duration;

    const duration = (selectedEnd - selectedStart) * audioBuffer.duration;

    newAudioSource.start(0, playbackOffset, duration);

    setAudioSource(newAudioSource);
    dispatch(setStartTime(audioContext.context.currentTime));
  };

  const pauseSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying(false));

    audioSource.stop();
    dispatch(
      setPausedTime(audioContext.context.currentTime - startTime + pausedTime)
    );
    setAudioSource(null);
  };

  const stopSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying(false));

    audioSource.stop();
    setAudioSource(null);
    dispatch(setPausedTime(0));

    dispatch(setProgressPosition(0));
  };

  const handleVolumeChange = event => {
    const newVolume = event.target.value;
    dispatch(setVolume(newVolume));

    if (audioContext && audioContext.gainNode) {
      audioContext.gainNode.gain.value = newVolume;
    }
  };

  const handlePitchChange = delta => {
    const newPitch = parseFloat(pitch + delta);
    if (newPitch < 0.5 || newPitch > 2) return;
    dispatch(setPitch(newPitch));

    if (audioContext && audioContext.pitchShift) {
      audioContext.pitchShift.pitch = newPitch - 1;
    }
  };

  const handleTempoChange = delta => {
    const newTempo = parseFloat(tempo + delta);
    if (newTempo < 0.5 || newTempo > 2) return;
    dispatch(setTempo(newTempo));

    if (audioSource) {
      audioSource.playbackRate = newTempo;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const trimAudioBuffer = () => {
    if (!audioBuffer) return;

    const newBuffer = audioContext.context.createBuffer(
      audioBuffer.numberOfChannels,
      Math.floor((selectedEnd - selectedStart) * audioBuffer.length),
      audioBuffer.sampleRate
    );

    for (
      let channel = 0;
      channel < audioBuffer.numberOfChannels;
      channel += 1
    ) {
      const oldChannelData = audioBuffer.getChannelData(channel);
      const newChannelData = newBuffer.getChannelData(channel);

      const startSample = Math.floor(selectedStart * oldChannelData.length);
      const endSample = Math.floor(selectedEnd * oldChannelData.length);

      for (let i = startSample, j = 0; i < endSample; i += 1, j += 1) {
        newChannelData[j] = oldChannelData[i];
      }
    }

    setAudioBuffer(newBuffer);
  };

  return (
    <div>
      <Waveform
        file={file}
        onAudioBufferLoaded={setAudioBuffer}
        waveformColor="#b3ecec"
        onSelectionChange={(start, end) => {
          dispatch(setSelectedStart(start));
          dispatch(setSelectedEnd(end));

          if (audioBuffer) {
            const newPausedTime = start * audioBuffer.duration;
            dispatch(setPausedTime(newPausedTime));
            const newProgressPosition = start * 100;
            dispatch(setProgressPosition(newProgressPosition));
          }
        }}
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
      <Button onClick={trimAudioBuffer}>Trim Audio</Button>
    </div>
  );
}

export default AudioPlayer;
