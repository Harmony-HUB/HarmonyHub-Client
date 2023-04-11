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

  useEffect(() => {
    const newAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    setAudioContext(newAudioContext);
  }, []);

  const playSound = () => {
    if (!audioContext || !audioBuffer) return;

    const newAudioSource = audioContext.createBufferSource();
    newAudioSource.buffer = audioBuffer;
    newAudioSource.connect(audioContext.destination);
    newAudioSource.start(0, pausedTime);

    setAudioSource(newAudioSource);
    setStartTime(audioContext.currentTime);
  };

  const pauseSound = () => {
    if (!audioSource) return;

    audioSource.stop();
    setPausedTime(audioContext.currentTime - startTime + pausedTime);
    setAudioSource(null);
  };

  const stopSound = () => {
    if (!audioSource) return;

    audioSource.stop();
    setAudioSource(null);
    setPausedTime(0);
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
      <Waveform file={file} onAudioBufferLoaded={setAudioBuffer} />
    </div>
  );
}

export default AudioPlayer;
