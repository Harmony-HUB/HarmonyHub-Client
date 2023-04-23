import { useEffect, useState } from "react";
import * as Tone from "tone";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Waveform from "../Waveform/Waveform";
import { SliderContainer, SliderInput, AudioPlayerContainer } from "./styles";
import AudioStorage from "../AudioStorage";
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
  // handleDroppedWaveform,
} from "../../feature/audioPlayerSlice";
// import VerticalSlider from "../VerticalSlider";
import Controls from "./Control";

function AudioPlayer({ file, cutWaveformBuffer, userData }) {
  // const [fadeIn, setFadeIn] = useState(0);
  // const [fadeOut, setFadeOut] = useState(0);
  const [isTrimmed, setIsTrimmed] = useState(false);
  const [audioPlayedId] = useState(uuidv4());

  const {
    audioSource,
    audioBuffer,
    audioContext,
    startTime,
    pausedTime,
    isPlaying,
    volume,
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
    const newAudioContext = Tone.getContext();
    const gainNode = new Tone.Gain(1).toDestination();
    const pitchShift = new Tone.PitchShift(0).connect(gainNode);

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
    dispatch(
      setProgressPosition({ audioPlayedId, progressPosition: progress })
    );
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

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: true }));

    const newAudioSource = new Tone.GrainPlayer(audioBuffer, () => {
      dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
    });
    newAudioSource.connect(audioContext.pitchShift);
    audioContext.gainNode.connect(audioContext.context.destination);
    newAudioSource.playbackRate = 1;
    newAudioSource.loop = false;

    const playbackOffset = isTrimmed
      ? Math.max(0, pausedTime)
      : Math.max(selectedStart * audioBuffer.duration, pausedTime);

    const duration = isTrimmed
      ? audioBuffer.duration - playbackOffset
      : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

    newAudioSource.start(0, playbackOffset, duration);

    // if (fadeIn > 0) {
    //   newAudioSource.volume.setValueAtTime(-Infinity, playbackOffset);
    //   newAudioSource.volume.linearRampToValueAtTime(
    //     0,
    //     playbackOffset + fadeIn + duration
    //   );
    // }

    // if (fadeOut > 0) {
    //   newAudioSource.volume.setValueAtTime(0, playbackOffset + duration);
    //   newAudioSource.volume.linearRampToValueAtTime(
    //     -Infinity,
    //     playbackOffset + duration - fadeOut * duration
    //   );
    // }

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
    dispatch(setPausedTime({ audioPlayedId, pausedTime: 0 }));

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

    dispatch(setAudioBuffer({ audioPlayedId, audioBuffer: newBuffer }));
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
    setIsTrimmed(true);
  };

  const handleSelectionChange = (start, end) => {
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: start }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: end }));

    if (audioBuffer) {
      const newPausedTime = start * audioBuffer.duration;
      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
      const newProgressPosition = start * 100;
      dispatch(
        setProgressPosition({
          audioPlayedId,
          progressPosition: newProgressPosition,
        })
      );
    }
  };

  const handleWaveformClick = progressPercentage => {
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

  // const handleFadeInChange = event => {
  //   const newFadeIn = parseFloat(event.target.value);
  //   setFadeIn(newFadeIn);
  // };

  // const handleFadeOutChange = event => {
  //   const newFadeOut = parseFloat(event.target.value);
  //   setFadeOut(newFadeOut);
  // };

  return (
    <AudioPlayerContainer>
      <Waveform
        file={file}
        waveformColor="#b3ecec"
        onSelectionChange={handleSelectionChange}
        onWaveformClick={handleWaveformClick}
        isTrimmed={isTrimmed}
        audioPlayedId={audioPlayedId}
      />
      <Controls
        playSound={playSound}
        pauseSound={pauseSound}
        stopSound={stopSound}
        handlePitchChange={handlePitchChange}
        handleTempoChange={handleTempoChange}
        // handleDroppedWaveform={handleDroppedWaveform}
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
      <AudioStorage audioBuffer={audioBuffer} userData={userData} />
      <Button onClick={trimAudioBuffer}>Trim Audio</Button>
    </AudioPlayerContainer>
  );
}
export default AudioPlayer;
