import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import Waveform from "./Waveform";
import Button from "./common/Button";
import ButtonWrapper from "./common/ButtonWrapper";

function AudioPlayer({ file }) {
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    setAudioContext(newAudioContext);
  }, []);

  const updateProgress = () => {
    if (!audioContext || !audioBuffer || !isPlaying) return;

    const currentTime = audioContext.currentTime - startTime + pausedTime;
    const progress = (currentTime / audioBuffer.duration) * 100;
    setProgressPosition(progress);
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        updateProgress();
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isPlaying, updateProgress]);

  const playSound = () => {
    if (!audioContext || !audioBuffer || audioSource) return;

    setIsPlaying(true);

    const newAudioSource = audioContext.createBufferSource();
    newAudioSource.buffer = audioBuffer;
    newAudioSource.connect(audioContext.destination);
    newAudioSource.start(0, pausedTime);

    setAudioSource(newAudioSource);
    setStartTime(audioContext.currentTime);
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
      />
    </div>
  );
}

export default AudioPlayer;
