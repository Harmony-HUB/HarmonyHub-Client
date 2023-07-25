import { useEffect, useState } from "react";
import { getContext, Gain, PitchShift } from "tone";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import Waveform from "../Waveform/Waveform";
import AudioStorage from "../Storage/AudioStorage";
import { AudioPlayerContainer, ButtonContainer } from "./styles";
import Button from "../common/Button/Button.tsx";
import {
  setAudioContext,
  setAudioBuffer,
  setAudioSource,
  setPausedTime,
  setProgressPosition,
  setIsPlaying,
  setPitch,
  setTempo,
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice.tsx";
import Controls from "./Controls.tsx";
import Volume from "../handleMusic/Volume/Volume.tsx";
import Play from "../handleMusic/Play/Play.tsx";

function AudioPlayer({ file, cutWaveformBuffer, userData, audioPlayedId }) {
  const [isTrimmed, setIsTrimmed] = useState(false);

  const {
    audioSource,
    audioBuffer,
    audioContext,
    volume,
    startTime,
    pausedTime,
    isPlaying,
    pitch,
    tempo,
    selectedStart,
    selectedEnd,
  } = useSelector(state => state.audioPlayer.instances[audioPlayedId] || {});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
  }, []);

  useEffect(() => {
    if (cutWaveformBuffer) {
      dispatch(
        setAudioBuffer({
          audioPlayedId,
          audioBuffer: cutWaveformBuffer,
        })
      );
      setIsTrimmed(true);
    }
  }, [cutWaveformBuffer]);

  useEffect(() => {
    const newAudioContext = getContext();
    const gainNode = new Gain(1).toDestination();
    const pitchShift = new PitchShift(0).connect(gainNode);

    dispatch(
      setAudioContext({
        audioPlayedId,
        audioContext: {
          context: newAudioContext,
          gainNode,
          pitchShift,
        },
      })
    );
  }, [audioPlayedId]);

  const pauseSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

    audioSource.stop();
    const elapsedTime = audioContext.context.currentTime - startTime;
    const newPausedTime = elapsedTime + pausedTime;

    dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
    dispatch(setAudioSource({ audioPlayedId, audioSource: null }));
  };

  const stopSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

    audioSource.stop();
    dispatch(setAudioSource({ audioPlayedId, audioSource: null }));

    const newPausedTime = selectedStart * audioBuffer.duration;
    dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));

    dispatch(
      setProgressPosition({
        audioPlayedId,
        progressPosition: selectedStart * 100,
      })
    );
  };

  const handlePitchChange = delta => {
    const newPitch = parseFloat(pitch + delta);

    if (newPitch < 0.5 || newPitch > 2) return;
    dispatch(setPitch({ audioPlayedId, pitch: newPitch }));

    if (audioContext && audioContext.pitchShift) {
      audioContext.pitchShift.pitch = newPitch - 1;
    }
  };

  const handleTempoChange = delta => {
    const newTempo = parseFloat(tempo + delta);
    if (newTempo < 0.5 || newTempo > 2) return;
    dispatch(setTempo({ audioPlayedId, tempo: newTempo }));

    if (audioSource) {
      audioSource.playbackRate = newTempo;
    }
  };

  const copyAudioChannelData = (
    oldBuffer,
    newBuffer,
    channel,
    startRatio,
    endRatio
  ) => {
    const oldChannelData = oldBuffer.getChannelData(channel);
    const newChannelData = newBuffer.getChannelData(channel);

    const startSample = Math.floor(startRatio * oldChannelData.length);
    const endSample = Math.floor(endRatio * oldChannelData.length);

    for (let i = startSample, j = 0; i < endSample; i += 1, j += 1) {
      newChannelData[j] = oldChannelData[i];
    }
  };

  const trimAudioBuffer = () => {
    if (!audioBuffer || audioBuffer.duration <= 1) return;

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
      copyAudioChannelData(
        audioBuffer,
        newBuffer,
        channel,
        selectedStart,
        selectedEnd
      );
    }

    dispatch(setAudioBuffer({ audioPlayedId, audioBuffer: newBuffer }));
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
    setIsTrimmed(true);
  };

  const onWaveformClick = progressPercentage => {
    if (isPlaying) {
      pauseSound();
    }

    const newPausedTime = (progressPercentage / 100) * audioBuffer.duration;
    dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
  };

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform
        file={file}
        waveformColor="#b3ecec"
        onWaveformClick={onWaveformClick}
        isTrimmed={isTrimmed}
        audioPlayedId={audioPlayedId}
        volume={volume}
      />
      <Controls
        pauseSound={pauseSound}
        stopSound={stopSound}
        handlePitchChange={handlePitchChange}
        handleTempoChange={handleTempoChange}
      />
      <Play audioPlayedId={audioPlayedId} />
      <Volume audioPlayedId={audioPlayedId} />
      <ButtonContainer>
        <Button data-testid="trim-button" onClick={trimAudioBuffer}>
          <FontAwesomeIcon icon={faScissors} />
        </Button>
        <AudioStorage
          audioPlayedId={audioPlayedId}
          userData={userData}
          audioBuffer={audioBuffer}
        />
      </ButtonContainer>
    </AudioPlayerContainer>
  );
}
export default AudioPlayer;
