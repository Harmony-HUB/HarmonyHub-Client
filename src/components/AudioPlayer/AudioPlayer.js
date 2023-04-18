import { useEffect, useState } from "react";
import * as Tone from "tone";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Waveform from "../Waveform/Waveform";
import { SliderContainer, SliderInput } from "./styles";
import Controls from "./Control";
import Button from "../common/Button/Button";
import {
  setAudioContext,
  setAudioBuffer,
  setAudioSource,
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
import VerticalSlider from "../VerticalSlider";

const VerticalSliderWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

function AudioPlayer({ file }) {
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [isTrimmed, setIsTrimmed] = useState(false);

  const startTime = useSelector(state => state.audioPlayer.startTime);
  const pausedTime = useSelector(state => state.audioPlayer.pausedTime);
  const isPlaying = useSelector(state => state.audioPlayer.isPlaying);
  const volume = useSelector(state => state.audioPlayer.volume);
  const pitch = useSelector(state => state.audioPlayer.pitch);
  const tempo = useSelector(state => state.audioPlayer.tempo);
  const selectedStart = useSelector(state => state.audioPlayer.selectedStart);
  const selectedEnd = useSelector(state => state.audioPlayer.selectedEnd);
  const audioContext = useSelector(state => state.audioPlayer.audioContext);
  const audioBuffer = useSelector(state => state.audioPlayer.audioBuffer);
  const audioSource = useSelector(state => state.audioPlayer.audioSource);

  const dispatch = useDispatch();

  useEffect(() => {
    const newAudioContext = new Tone.Context();
    const gainNode = new Tone.Gain(1).toDestination();
    const pitchShift = new Tone.PitchShift(0).connect(gainNode);

    dispatch(
      setAudioContext({
        context: newAudioContext,
        gainNode,
        pitchShift,
      })
    );
  }, []);

  const updateProgress = () => {
    if (!audioContext || !audioBuffer || !isPlaying) return;

    const currentTime =
      audioContext.context.currentTime - startTime + pausedTime;
    const progress = (currentTime / audioBuffer.duration) * 100;
    dispatch(setProgressPosition(progress));
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        updateProgress();
      }, 10);

      return () => {
        clearInterval(interval);
      };
    }

    return updateProgress();
  }, [isPlaying]);

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

    const playbackOffset = isTrimmed
      ? Math.max(0, pausedTime)
      : Math.max(selectedStart * audioBuffer.duration, pausedTime);

    const duration = isTrimmed
      ? audioBuffer.duration - playbackOffset
      : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

    newAudioSource.start(0, playbackOffset, duration);

    if (fadeIn > 0) {
      newAudioSource.volume.setValueAtTime(-Infinity, playbackOffset);
      newAudioSource.volume.linearRampToValueAtTime(
        0,
        playbackOffset + fadeIn + duration
      );
    }

    if (fadeOut > 0) {
      newAudioSource.volume.setValueAtTime(0, playbackOffset + duration);
      newAudioSource.volume.linearRampToValueAtTime(
        -Infinity,
        playbackOffset + duration - fadeOut * duration
      );
    }

    dispatch(setAudioSource(newAudioSource));
    dispatch(setStartTime(audioContext.context.currentTime));
  };

  const pauseSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying(false));

    audioSource.stop();
    const elapsedTime = audioContext.context.currentTime - startTime;
    const newPausedTime = elapsedTime + pausedTime;

    dispatch(setPausedTime(newPausedTime));
    dispatch(setAudioSource(null));
  };

  const stopSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying(false));

    audioSource.stop();
    dispatch(setAudioSource(null));
    dispatch(setPausedTime(0));

    dispatch(setProgressPosition(selectedStart * 100));
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

    dispatch(setAudioBuffer(newBuffer));
    setIsTrimmed(true);
  };

  const handleSelectionChange = (start, end) => {
    dispatch(setSelectedStart(start));
    dispatch(setSelectedEnd(end));

    if (audioBuffer) {
      const newPausedTime = start * audioBuffer.duration;
      dispatch(setPausedTime(newPausedTime));
      const newProgressPosition = start * 100;
      dispatch(setProgressPosition(newProgressPosition));
    }
  };

  const handleWaveformClick = progressPercentage => {
    dispatch(setProgressPosition(progressPercentage));

    if (audioBuffer) {
      const newPausedTime = (progressPercentage / 100) * audioBuffer.duration;
      dispatch(setPausedTime(newPausedTime));
    }
  };

  const handleFadeInChange = event => {
    const newFadeIn = parseFloat(event.target.value);
    setFadeIn(newFadeIn);
  };

  const handleFadeOutChange = event => {
    const newFadeOut = parseFloat(event.target.value);
    setFadeOut(newFadeOut);
  };

  return (
    <div>
      <Waveform
        file={file}
        waveformColor="#b3ecec"
        onSelectionChange={handleSelectionChange}
        onWaveformClick={handleWaveformClick}
        audioBuffer={audioBuffer}
        isTrimmed={isTrimmed}
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
      <VerticalSliderWrapper>
        <VerticalSlider
          label="Fade In"
          min="0"
          max="10"
          step="0.1"
          value={fadeIn}
          onChange={handleFadeInChange}
        />
        <VerticalSlider
          label="Fade Out"
          min="0"
          max="10"
          step="0.1"
          value={fadeOut}
          onChange={handleFadeOutChange}
        />
      </VerticalSliderWrapper>
      <Button onClick={trimAudioBuffer}>Trim Audio</Button>
    </div>
  );
}
export default AudioPlayer;
