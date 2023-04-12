import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import Waveform from "./Waveform";
import Button from "./common/Button/Button";
import ButtonWrapper from "./common/ButtonWrapper/ButtonWrapper";
import { SliderContainer, SliderInput } from "./styles";

function AudioPlayer({ file }) {
  const [audioContext, setAudioContext] = useState({
    context: null,
    gainNode: null,
  });
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const newAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const gainNode = newAudioContext.createGain();
    setAudioContext({
      context: newAudioContext,
      gainNode,
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

  const playSound = () => {
    if (!audioContext || !audioContext.context || !audioBuffer || audioSource)
      return;

    setIsPlaying(true);

    const newAudioSource = audioContext.context.createBufferSource();
    newAudioSource.buffer = audioBuffer;
    newAudioSource.connect(audioContext.gainNode);
    audioContext.gainNode.connect(audioContext.context.destination);

    newAudioSource.start(0, pausedTime);

    setAudioSource(newAudioSource);
    setStartTime(audioContext.context.currentTime);
  };

  const pauseSound = () => {
    if (!audioSource) return;

    setIsPlaying(false);

    audioSource.disconnect();
    setPausedTime(audioContext.currentTime - startTime + pausedTime);
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

  const horizontalButtonsConfig = [
    {
      id: "play-button",
      icon: faPlay,
      margin: "",
      onClick: () => playSound(),
    },
    {
      id: "pause-button",
      icon: faPause,
      margin: "0 0 0 1rem",
      onClick: () => pauseSound(),
    },
    {
      id: "stop-button",
      icon: faStop,
      margin: "0 0 0 1rem",
      onClick: () => stopSound(),
    },
  ];

  return (
    <div>
      <ButtonWrapper bottom="10%" left="3%">
        {horizontalButtonsConfig.map(config => (
          <Button
            id={config.id}
            margin={config.margin}
            key={config.id}
            onClick={config.onClick}
          >
            <FontAwesomeIcon icon={config.icon} />
          </Button>
        ))}
      </ButtonWrapper>
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
    </div>
  );
}

export default AudioPlayer;
