import { useEffect, useState } from "react";
import { getContext, Gain, PitchShift, GrainPlayer } from "tone";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import Waveform from "../Waveform/Waveform";
import AudioStorage from "../Storage/AudioStorage";
import { AudioPlayerContainer, ButtonContainer } from "./styles";
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
import Controls from "./Controls";

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

  const updateProgress = () => {
    if (!audioContext || !audioBuffer || !isPlaying) return;

    const currentTime =
      audioContext.context.currentTime - startTime + pausedTime;
    const progress = (currentTime / audioBuffer.duration) * 100;

    console.log(progress);
    dispatch(
      setProgressPosition({ audioPlayedId, progressPosition: progress })
    );
  };

  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      updateProgress();
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      loop();
    } else {
      updateProgress();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const playSound = async () => {
    if (!audioContext || !audioContext.context || !audioBuffer || audioSource)
      return;

    if (audioContext.context.state === "suspended") {
      await audioContext.context.resume();
    }

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: true }));

    const newAudioSource = new GrainPlayer(audioBuffer, () => {
      dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
    });
    newAudioSource.connect(audioContext.pitchShift);
    audioContext.gainNode.connect(audioContext.context.destination);
    newAudioSource.playbackRate = tempo;
    newAudioSource.loop = false;

    const playbackOffset = isTrimmed
      ? Math.max(0, pausedTime)
      : Math.max(selectedStart * audioBuffer.duration, pausedTime);

    const duration = isTrimmed
      ? audioBuffer.duration - playbackOffset
      : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

    newAudioSource.start(0, playbackOffset, duration);

    dispatch(setAudioSource({ audioPlayedId, audioSource: newAudioSource }));
    dispatch(
      setStartTime({
        audioPlayedId,
        startTime: audioContext.context.currentTime,
      })
    );
  };

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

  const handleVolumeChange = event => {
    const newVolume = event.target.value;
    dispatch(setVolume({ audioPlayedId, volume: newVolume }));

    if (audioContext && audioContext.gainNode) {
      audioContext.gainNode.gain.value = newVolume;
    }
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

  const handleWaveformClick = progressPercentage => {
    if (isPlaying) {
      pauseSound();
    }

    dispatch(
      setProgressPosition({
        audioPlayedId,
        progressPosition: progressPercentage,
      })
    );

    if (audioBuffer) {
      const newPausedTime = (progressPercentage / 100) * audioBuffer.duration;
      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
    }
  };

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform
        file={file}
        waveformColor="#b3ecec"
        onWaveformClick={handleWaveformClick}
        isTrimmed={isTrimmed}
        audioPlayedId={audioPlayedId}
        volume={volume}
      />
      <Controls
        playSound={playSound}
        pauseSound={pauseSound}
        stopSound={stopSound}
        handlePitchChange={handlePitchChange}
        handleTempoChange={handleTempoChange}
        handleVolumeChange={handleVolumeChange}
      />
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
