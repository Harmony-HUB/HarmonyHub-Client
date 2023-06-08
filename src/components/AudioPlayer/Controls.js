import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faMinus,
  faHashtag,
  faBackwardFast,
  faForwardFast,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button/Button";
import { StyledVolumeSlider } from "./styles";

function Controls({
  playSound,
  pauseSound,
  stopSound,
  handlePitchChange,
  handleTempoChange,
  handleVolumeChange,
}) {
  const [showSlider, setShowSlider] = useState(false);

  const horizontalButtonsConfig = [
    {
      id: "play-button",
      icon: faPlay,
      margin: "",
      onClick: playSound,
    },
    {
      id: "pause-button",
      icon: faPause,
      margin: "0 0 0 1rem",
      onClick: pauseSound,
    },
    {
      id: "stop-button",
      icon: faStop,
      margin: "0 0 0 1rem",
      onClick: stopSound,
    },
    {
      id: "pitch-down-button",
      icon: faMinus,
      margin: "0 0 0 1rem",
      onClick: () => handlePitchChange(-0.1),
    },
    {
      id: "pitch-up-button",
      icon: faHashtag,
      margin: "0 0 0 1rem",
      onClick: () => handlePitchChange(0.1),
    },
    {
      id: "tempo-down-button",
      icon: faBackwardFast,
      margin: "0 0 0 1rem",
      onClick: () => handleTempoChange(-0.1),
    },
    {
      id: "tempo-up-button",
      icon: faForwardFast,
      margin: "0 0 0 1rem",
      onClick: () => handleTempoChange(0.1),
    },
  ];

  const handleMouseEnter = () => {
    setShowSlider(true);
  };

  const handleMouseLeave = () => {
    setShowSlider(false);
  };

  return (
    <div>
      {horizontalButtonsConfig.map(config => (
        <Button
          id={config.id}
          data-testid={config.id}
          margin={config.margin}
          key={config.id}
          onClick={config.onClick}
        >
          <FontAwesomeIcon icon={config.icon} />
        </Button>
      ))}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block" }}
      >
        <FontAwesomeIcon icon={faVolumeUp} />
        <StyledVolumeSlider
          onChange={handleVolumeChange}
          defaultValue="1"
          style={{
            visibility: showSlider ? "visible" : "hidden",
          }}
          data-testid="volume-slider"
        />
      </div>
    </div>
  );
}

export default Controls;
