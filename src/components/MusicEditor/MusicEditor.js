import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button/Button";
import ButtonWrapper from "../common/ButtonWrapper/ButtonWrapper";
import EqualizerSlider from "../EqualizerSlider/EqualizerSlider";
import AudioPlayer from "../AudioPlayer";
import { Editor, SelectFileButton, FileInput } from "./styles";

function MusicEditor() {
  const [isEqualizer, setIsEqualizer] = useState(false);
  const [file, setFile] = useState("");
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
    { label: "0", value: sliderValues[100], onChange: handleSliderChange },
    { label: "60", value: sliderValues[100], onChange: handleSliderChange },
    { label: "170", value: sliderValues[100], onChange: handleSliderChange },
    { label: "310", value: sliderValues[100], onChange: handleSliderChange },
    { label: "600", value: sliderValues[100], onChange: handleSliderChange },
    { label: "1k", value: sliderValues[100], onChange: handleSliderChange },
    { label: "3k", value: sliderValues[100], onChange: handleSliderChange },
    { label: "6k", value: sliderValues[100], onChange: handleSliderChange },
    { label: "12k", value: sliderValues[100], onChange: handleSliderChange },
    { label: "14k", value: sliderValues[100], onChange: handleSliderChange },
    { label: "16k", value: sliderValues[100], onChange: handleSliderChange },
  ];

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    const fileURL = URL.createObjectURL(selectedFile);
    setFile(fileURL);
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
      {file ? (
        <AudioPlayer file={file} />
      ) : (
        <SelectFileButton>
          <FontAwesomeIcon icon={faUpload} /> 파일 선택
          <FileInput type="file" onChange={handleFileChange} />
        </SelectFileButton>
      )}
      <ButtonWrapper bottom="85%">
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
