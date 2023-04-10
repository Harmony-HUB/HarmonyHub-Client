import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faUpload,
  faPause,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import ButtonWrapper from "../common/ButtonWrapper";
import EqualizerSlider from "../EqualizerSlider";

const Editor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 80%;
  height: 60%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const SelectFileButton = styled.label`
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  background: #3f51b5;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #536dfe;
  }
`;

const FileInput = styled.input`
  display: none;
`;

function MusicEditor() {
  const [isEqualizer, setIsEqualizer] = useState(false);
  const [sliderValues, setSliderValues] = useState({
    0: 50,
    60: 50,
    170: 50,
    310: 50,
    600: 50,
    "1k": 50,
    "3k": 50,
    "6k": 50,
    "12k": 50,
    "14k": 50,
    "16k": 50,
  });

  const handleSliderChange = (label, newValue) => {
    setSliderValues({ ...sliderValues, [label]: newValue });
  };

  const clickEqualizer = () => {
    setIsEqualizer(!isEqualizer);
  };

  const horizontalButtonsConfig = [
    {
      id: "play-button",
      icon: faPlay,
      margin: "",
    },
    {
      id: "pause-button",
      icon: faPause,
      margin: "0 0 0 1rem",
    },
    {
      id: "stop-button",
      icon: faStop,
      margin: "0 0 0 1rem",
    },
  ];

  const verticalButtonConfig = [
    {
      id: "equalizer-button",
      name: "Equalizer",
      onClick: () => clickEqualizer("equalizer-button"),
    },
    {
      id: "volume-button",
      name: "Volume",
    },
    {
      id: "autotune-button",
      name: "AutoTune",
    },
  ];

  const slidersConfig = [
    { label: "0", value: sliderValues[20], onChange: handleSliderChange },
    { label: "60", value: sliderValues[40], onChange: handleSliderChange },
    { label: "170", value: sliderValues[400], onChange: handleSliderChange },
    { label: "310", value: sliderValues[1600], onChange: handleSliderChange },
    { label: "600", value: sliderValues[3200], onChange: handleSliderChange },
    { label: "1k", value: sliderValues[6400], onChange: handleSliderChange },
    { label: "3k", value: sliderValues[6400], onChange: handleSliderChange },
    { label: "6k", value: sliderValues[6400], onChange: handleSliderChange },
    { label: "12k", value: sliderValues[6400], onChange: handleSliderChange },
    { label: "14k", value: sliderValues[6400], onChange: handleSliderChange },
    { label: "16k", value: sliderValues[6400], onChange: handleSliderChange },
  ];

  const handleFileChange = event => {
    const file = event.target.files[0];
    console.log(file);
  };

  return (
    <Editor>
      <div>
        {isEqualizer
          ? slidersConfig.map(config => (
              <EqualizerSlider
                key={config.label}
                label={config.label}
                value={config.value}
                min={0}
                max={100}
                onChange={e => config.onChange(config.label, e.target.value)}
              />
            ))
          : null}
      </div>
      <SelectFileButton>
        <FontAwesomeIcon icon={faUpload} /> 파일 선택
        <FileInput type="file" onChange={handleFileChange} />
      </SelectFileButton>
      <ButtonWrapper bottom="10%" left="3%">
        {horizontalButtonsConfig.map(config => (
          <Button id={config.id} margin={config.margin} key={config.id}>
            <FontAwesomeIcon icon={config.icon} />
          </Button>
        ))}
      </ButtonWrapper>
      <ButtonWrapper bottom="70%" direction="vertical">
        {verticalButtonConfig.map(config => (
          <Button id={config.id} key={config.id} onClick={config.onClick}>
            {config.name}
          </Button>
        ))}
      </ButtonWrapper>
    </Editor>
  );
}

export default MusicEditor;
